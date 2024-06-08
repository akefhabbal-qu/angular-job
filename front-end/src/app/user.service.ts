import { Injectable } from "@angular/core";
import { MaterialsData } from "./materials";
import { UserData } from "./userdata";
import { ServerResponse } from "./server-reponse";
import axios from "axios";

@Injectable({
  providedIn: "root",
})
export class UserService {
  domain = "http://localhost:8080";
  post_login_endpoint = "/user/login";
  get_user_endpoint = "/user/data";

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

  async login(email: string, password: string): Promise<string> {
    try {
      const url = this.domain + this.post_login_endpoint;
      const response = await axios.post(url, {
        email,
        password,
      });

      const loginResponse = this.handleResponse(response);

      return loginResponse;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserData(email: string): Promise<UserData> {
    try {
      const token = localStorage.getItem("token");
      const url = this.domain + this.get_user_endpoint;
      const response = await axios.get(`${url}?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData: UserData = this.handleResponse(response);
      return userData;
    } catch (error) {
      this.handleError(error);
    }
  }
}
