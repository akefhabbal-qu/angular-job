import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";

@Component({
  standalone: true,
  selector: "app-root",
  template: ` <main>
    <header class="brand-name">
      <img
        class="brand-logo"
        src="assets/logo.jpg"
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
