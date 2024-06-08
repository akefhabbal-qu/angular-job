import { Injectable } from "@angular/core";
import { MaterialsData } from "./materials";
import { UserData } from "./userdata";
import { ServerResponse } from "./server-reponse";
import axios from "axios";

@Injectable({
  providedIn: "root",
})
export class POService {
  domain = "http://localhost:8080";
  get_all_materials_endpoint = "/materials/all";

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
      const url = this.domain + this.get_all_materials_endpoint;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const materialsResponse = this.handleResponse(response);

      return materialsResponse as MaterialsData[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
