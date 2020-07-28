import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutLoginPageComponent } from './layout-login-page/layout-login-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { ForgetPasswordPageComponent } from './forget-password-page/forget-password-page.component';



@NgModule({
  declarations: [LayoutLoginPageComponent, AboutPageComponent, LoginPageComponent, SignupPageComponent, ForgetPasswordPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FormsModule
  ]
})
export class LoginModule { }
