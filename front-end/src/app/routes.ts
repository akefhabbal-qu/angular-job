import { Routes } from "@angular/router";
import { LoginComponent as LoginComponent } from "./login/login.component";
import { POGeneratorComponent as POGeneratorComponent } from "./po-generator/po-generator.component";
import { HomeComponent } from "./home/home.component";

const routeConfig: Routes = [
  {
    path: "",
    component: HomeComponent,
    title: "Home Page",
  },
  {
    path: "login",
    component: LoginComponent,
    title: "Login Page",
  },
  {
    path: "pdf-generator",
    component: POGeneratorComponent,
    title: "PDF Generator Page",
  },
];

export default routeConfig;
