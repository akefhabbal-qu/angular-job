import { Component } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { RouterModule } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-root",
  template: ` <main>
    <header class="brand-name">
      <img
        class="brand-logo"
        src="assets/logo.svg"
        alt="Al Attiyah Logo"
        aria-hidden="true"
      />
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </header>
  </main>`,
  styleUrls: ["./app.component.css"],
  imports: [HomeComponent, RouterModule],
})
export class AppComponent {
  title = "Al Attiyah";
}
