import { Injectable } from "@angular/core";
import { HousingLocation } from "./housing-location";

@Injectable({
  providedIn: "root",
})
export class HousingService {
  url = "http://localhost:3000/locations";

  constructor() {}

  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async getHousingLocationById(
    id: number
  ): Promise<HousingLocation | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }

  submitApplication(firstName: string, lastName: string, email: string): void {
    console.log("Application submitted", { firstName, lastName, email });
  }

  async login(email: string, password: string): Promise<string> {
    const data = await fetch("http://localhost:3000/login", {
      method: "GET",
      // body: JSON.stringify({ email, password }),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    });

    const response = await data.json();
    if (response.error) {
      return response.error;
    }

    return response.token;
  }
}
