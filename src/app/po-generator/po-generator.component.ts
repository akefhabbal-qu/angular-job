import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HousingService } from "../housing.service";
import { HousingLocation } from "../housing-location";
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
            <tbody>
              <tr>
                <td><input type="checkbox" /></td>
                <td>Concrete</td>
                <td>6000 QR</td>
              </tr>
              <tr class="active-row">
                <td><input type="checkbox" /></td>
                <td>Sand</td>
                <td>5150 QR</td>
              </tr>
              <!-- and so on... -->
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
  housingService: HousingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;
  applyForm = new FormGroup({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    email: new FormControl(""),
  });

  constructor() {
    const housingLocationId = Number(this.route.snapshot.params["id"]);
    this.housingService
      .getHousingLocationById(housingLocationId)
      .then((location) => {
        this.housingLocation = location;
      });
  }

  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? "",
      this.applyForm.value.lastName ?? "",
      this.applyForm.value.email ?? ""
    );
  }

  generatePdf() {
    const data = [
      ["Name", "Email", "Country"],
      ["John Doe", "johndoe@example.com", "USA"],
      ["Jane Smith", "janesmith@example.com", "Canada"],
      ["Bob Johnson", "bobjohnson@example.com", "UK"],
    ];

    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: "User Data", style: "header" },
        { table: { body: data } },
      ],
      // styles: {
      //   header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      // },
      footer: function (currentPage, pageCount) {
        return currentPage.toString() + " of " + pageCount;
      },
      header: function (currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element

        return [
          {
            text: "simple text",
            alignment: currentPage % 2 ? "left" : "right",
          },
          {
            canvas: [
              { type: "rect", x: 170, y: 32, w: pageSize.width - 170, h: 40 },
            ],
          },
        ];
      },
    };

    var html = htmlToPdfmake(
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
              <tr class="trs">
                  <td class="thds">Concrete</td>
                  <td class="thds">6000 QR</td>
              </tr>
              <tr class="active-row">
                  <td class="thds">Sand</td>
                  <td class="thds">5150 QR</td>
              </tr>
          </tbody>
        </table>
      </div>
    `
    );

    const styles: StyleDictionary = {
      tThead: {
        // background: "#009879",
        // color: "#ffffff",
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
