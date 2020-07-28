import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutLoginPageComponent } from "./login/layout-login-page/layout-login-page.component";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { SignupPageComponent } from "./login/signup-page/signup-page.component";
import { AboutPageComponent } from "./login/about-page/about-page.component";
import { PageNotFoundComponent } from "./dashboard/page-not-found/page-not-found.component";
import { LayoutPageComponent } from "./shared/layout-page/layout-page.component";
import { AuthGuard } from "./login/auth.guard";
import { HomePageComponent } from "./dashboard/home-page/home-page.component";
import { ViewGroupPageComponent } from "./dashboard/view-group-page/view-group-page.component";
import { ViewExpensePageComponent } from "./dashboard/view-expense-page/view-expense-page.component";
import { ForgetPasswordPageComponent } from './login/forget-password-page/forget-password-page.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutLoginPageComponent,
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      { path: "login", component: LoginPageComponent },
      { path: "signup", component: SignupPageComponent },
      { path: "about", component: AboutPageComponent },
      { path: "forget/password", component: ForgetPasswordPageComponent}
    ],
  },

  {
    path: "dashboard",
    canActivate: [AuthGuard],
    component: LayoutPageComponent,
    children: [
      {
        path: "",
        component: HomePageComponent,
        pathMatch: "full",
      },
      {
        path: "group/:groupId",
        component: ViewGroupPageComponent,
      },
      {
        path: "group/:groupId/expense/:expenseId",
        component: ViewExpensePageComponent,
      },
    ],
  },
  { path: "*", component: PageNotFoundComponent, pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
