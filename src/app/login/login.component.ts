import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "../home/home.component";
import { POService } from "../po.service";
import { Router, RouterModule } from "@angular/router";
import { JwtService } from "../jwt.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterModule, CommonModule, HomeComponent],
  template: `
    <section>
      <form>
        <input type="email" placeholder="Enter your email" #email />
        <br />
        <input type="password" placeholder="Enter your password" #password />
        <br />
        <button
          class="primary"
          type="button"
          (click)="loginClicked(email.value, password.value)"
        >
          Login
        </button>
      </form>
    </section>
  `,
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  housingService: POService = inject(POService);

  constructor(
    private readonly router: Router,
    private readonly jwtService: JwtService
  ) {}

  loginClicked(email: string, password: string): void {
    if (!email && !password) {
      return;
    }

    this.housingService.login(email, password).then((token) => {
      if (token) {
        console.log("Login successful");
        console.log("Token:", token);
        this.jwtService.saveToken(token);
        void this.router.navigate(["/"]);
      } else {
        console.log("Login failed");
      }
    });
  }
}
