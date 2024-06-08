import { Component, ElementRef, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { POService } from "../po.service";
import { MaterialsData } from "../materials";
import { ReactiveFormsModule } from "@angular/forms";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as pdfMake from "pdfmake/build/pdfmake";
import { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { Authentication, Credentials } from "../auth.service";
import { UserData } from "../userdata";
import { JwtService } from "../jwt.service";
var htmlToPdfmake = require("html-to-pdfmake");

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
            <p>Created by: {{ userData.name }}</p>
            <p>Issued at: {{ today | date : "fullDate" }}</p>
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
  auth: Authentication = inject(Authentication);
  userData: UserData = {} as UserData;
  today = new Date();

  @ViewChild("tbodyRef") tbody!: ElementRef<HTMLTableSectionElement>;

  constructor(private readonly jwtService: JwtService) {
    this.poService
      .getAllMaterials(jwtService.getToken())
      .then((materials: MaterialsData[]) => {
        this.materials = materials;
      });

    this.poService
      .getUserData(this.auth.getCredentials().username)
      .then((data) => {
        this.userData = data;
      });
  }

  generatePdf() {
    const selectedMaterials: MaterialsData[] = [];

    this.tbody.nativeElement.childNodes.forEach((trs: any) => {
      const tds = trs.childNodes;

      if (tds.length === 0) return;

      const checkbox = tds[0].firstChild as HTMLInputElement;
      if (checkbox.checked) {
        const id: string = checkbox.id;
        const material = this.materials.find((m) => m.id === id);
        if (material) {
          selectedMaterials.push(material);
        }
      }
    });

    let data = "";
    selectedMaterials.forEach((material) => {
      data =
        data +
        `
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
          <p>Created by: ${this.userData.name}</p>
          <p>Issued at: ${this.today}</p>
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
