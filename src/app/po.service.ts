import { Injectable } from "@angular/core";
import { MaterialsData } from "./materials";
import { UserData } from "./userdata";
import { ServerResponse } from "./server-reponse";
import axios from "axios";

@Injectable({
  providedIn: "root",
})
export class POService {
  url = "http://localhost:3000/materials";

  constructor() {}

  handleResponse(response: any): any {
    const serverResponse: ServerResponse = response.data;

    if (serverResponse.success) {
      return serverResponse.data;
    } else {
      console.error(response.config.url, response);
      throw new Error(
        `Couldn't get data from ${response.config.url}, response: ${serverResponse.response_status}`
      );
    }
  }

  handleError(error: any): never {
    if (error.response && error.response.data) {
      const serverResponse: ServerResponse = error.response.data;

      throw new Error(`${serverResponse.response_status}`);
    } else if (axios.isAxiosError(error)) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(`${error.response.data.message}`);
      } else {
        throw new Error(`${error.message}`);
      }
    }
    throw error;
  }

  async getAllMaterials(token: string): Promise<MaterialsData[]> {
    try {
      const url = "http://localhost:3000/materials";
      const response = await axios.get(url, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      const materialsResponse: { materials: [] } =
        this.handleResponse(response);

      return materialsResponse.materials as MaterialsData[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const url = "http://localhost:3000/login";
      const response = await axios.get(
        url
        //   {
        //   email,
        //   password,
        // }
      );

      const loginResponse: { token: string } = this.handleResponse(response);

      return loginResponse.token;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserData(email: string): Promise<UserData> {
    try {
      const url = "http://localhost:3000/user";
      const response = await axios.get(url, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      const userData: UserData = this.handleResponse(response);
      return userData;
    } catch (error) {
      this.handleError(error);
    }
  }
}
