import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HousingService } from "../housing.service";
import { HousingLocation } from "../housing-location";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-po-generator",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article class="details">
      <section class="listing-features">
        <h2 class="section-heading">About his housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation?.availableUnits }}</li>
          <li>Wi-Fi</li>
          <li>Laundry</li>
        </ul>
      </section>

      <button (click)="generatePdf()">Download PDF</button>
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
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    pdfMake
      .createPdf(docDefinition, {}, pdfMake.fonts, pdfFonts.pdfMake.vfs)
      .download("Purchase Order.pdf");
  }
}
