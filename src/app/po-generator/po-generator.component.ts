import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { POService } from "../po.service";
import { MaterialsData } from "../materials";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as pdfMake from "pdfmake/build/pdfmake";
// import * as htmlToPdfmake from "html-to-pdfmake";
var htmlToPdfmake = require("html-to-pdfmake");
import {
  Style,
  StyleDictionary,
  TDocumentDefinitions,
} from "pdfmake/interfaces";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-po-generator",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article class="details">
      <section class="listing-features">
        <div>
          <header>
            <h1>Purchase Order #1001</h1>
            <p>Created by: Ahmad Hussein</p>
            <p>Issued at: 10/05/2024</p>
          </header>
          <table class="styled-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody #tbodyRef>
              <tr *ngFor="let material of materials">
                <td>
                  <input
                    class="materialSelect"
                    type="checkbox"
                    id="{{ material.id }}"
                  />
                </td>
                <td>{{ material.name }}</td>
                <td>{{ material.price }} {{ material.unit_sign }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <button class="primary btn" type="button" (click)="generatePdf()">
        Generate PDF
      </button>
    </article>
  `,
  styleUrls: ["./po-generator.component.css"],
})
export class POGeneratorComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  poService: POService = inject(POService);
  materials: MaterialsData[] = [];

  @ViewChild("tbodyRef") tbody!: ElementRef<HTMLTableSectionElement>;

  constructor() {
    this.poService.getAllMaterials().then((materials: MaterialsData[]) => {
      this.materials = materials;
    });
  }

  generatePdf() {
    const selectedMaterials: MaterialsData[] = [];

    this.tbody.nativeElement.childNodes.forEach((tr: any) => {
      console.log(tr);

      // TODO: here here here
      const checkbox = tr.querySelector("input[type=checkbox]");
      if (checkbox.checked) {
        const id = parseInt(checkbox.id);
        const material = this.materials.find((m) => m.id === id);
        if (material) {
          selectedMaterials.push(material);
        }
      }
    });

    const data = selectedMaterials.forEach((material) => {
      return `
        <tr class="trs">
          <td>${material.name}</td>
          <td>${material.price} ${material.unit_sign}</td>
        </tr>
      `;
    });

    const html = htmlToPdfmake(
      `
      <div>
        <header>
          <h1>Purchase Order #1001</h1>
          <p>Created by: Ahmad Hussein</p>
          <p>Issued at: 10/05/2024</p>
        </header>
        <table class="fTable">
          <thead class="tThead">
            <tr class="trs">
              <th class="thds">Name</th>
              <th class="thds">Price</th>
            </tr>
          </thead>
          <tbody>
           ${data}
          </tbody>
        </table>
      </div>
    `
    );

    const styles: StyleDictionary = {
      tThead: {
        alignment: "left",
      },
      title: {
        color: "red",
      },
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      thds: {
        columnGap: 10,
        margin: 20,
      },
    };
    var dd: TDocumentDefinitions = {
      content: [
        html,
        {
          absolutePosition: { x: 40, y: 650 },
          table: {
            widths: ["*"],
            heights: [100],
            body: [
              [
                {
                  text: "Signature               ____________________________",
                  margin: [0, 50, 0, 0],
                  border: [true, true, true, true],
                },
              ],
            ],
          },
        },
      ],
      styles,
      header: {
        text: "Al Attiyah Company",
        alignment: "center",
        margin: [0, 10, 0, 0],
      },
      footer: function (currentPage, pageCount) {
        return "Page: " + currentPage.toString() + " of " + pageCount;
      },
    };

    pdfMake
      .createPdf(dd, {}, pdfMake.fonts, pdfFonts.pdfMake.vfs)
      .download("Purchase Order.pdf");
  }
}
