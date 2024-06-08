import { Injectable } from "@angular/core";

export interface Credentials {
  username: string;
  password: string;
}

@Injectable({ providedIn: "root" })
export class Authentication {
  getCredentials(): Credentials {
    return JSON.parse(window.localStorage["credentials"]);
  }

  saveCredentials(credentials: Credentials): void {
    window.localStorage["credentials"] = JSON.stringify(credentials);
  }

  destroyCredentials(): void {
    window.localStorage.removeItem("credentials");
  }
}
