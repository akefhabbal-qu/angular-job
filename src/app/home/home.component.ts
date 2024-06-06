import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialsData } from "../materials";
import { RouterModule } from "@angular/router";
import { Router } from "@angular/router";
import { JwtService } from "../jwt.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="listing">
      <h2 class="listing-heading">HI</h2>
      <a [routerLink]="['/pdf-generator']" class="listing-link"
        >PDF Generator</a
      >
    </section>
    <section>
      <button class="primary" type="button" (click)="logout()">Logout</button>
    </section>
  `,
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  constructor(
    private readonly router: Router,
    private readonly jwtService: JwtService
  ) {
    if (jwtService.getToken() === null) {
      //TODO: check token expiration
      void this.router.navigate(["/login"]);
      return;
    }
  }

  logout(): void {
    this.jwtService.destroyToken();
    void this.router.navigate(["/login"]);
  }
}
