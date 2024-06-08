import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "../home/home.component";
import { POService } from "../po.service";
import { Router, RouterModule } from "@angular/router";
import { JwtService } from "../jwt.service";
import { Authentication, Credentials } from "../auth.service";
import { UserService } from "../user.service";

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
  userService: UserService = inject(UserService);

  constructor(
    private readonly router: Router,
    private readonly jwtService: JwtService,
    private readonly creds: Authentication
  ) {}

  loginClicked(email: string, password: string): void {
    if (!email && !password) {
      return;
    }

    this.userService.login(email, password).then((token) => {
      if (token) {
        this.creds.saveCredentials({ username: email, password });
        this.jwtService.saveToken(token);
        void this.router.navigate(["/"]);
      } else {
        console.log("Login failed");
      }
    });
  }
}
