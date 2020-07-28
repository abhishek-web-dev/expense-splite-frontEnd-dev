import { Component, OnInit } from "@angular/core";
import { BaseURL } from "src/app/shared/base-url";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service";
import { ToastrManager } from "ng6-toastr-notifications";
import Swal from "sweetalert2";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrManager,
    private _sharedService: SharedService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  // this is for forget password
  forgotForm = () => {
    Swal.fire({
      title: "Input email address",
      input: "email",
      inputPlaceholder: "Enter your email address",
    }).then((result) => {
      // get gorget pass coad
      this._sharedService
        .post(BaseURL.BASE_USER_ENDPOINT + "generate/forget/password/code", {
          email: result.value,
        })
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              this._router.navigate(["/forget/password"]);
            } else {
              this._toastr.errorToastr(apiResponse.message, "Error");
            }
          },
          (err) => {
            this._toastr.errorToastr(err.message, "Error");
          }
        );
    });
  };

  createLoginForm(): void {
    this.loginForm = this._fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.required],
    });
    this.loginForm.reset();
  }

  // send reques for loging
  onSubmit(formData: any) {
    if (this.loginForm.valid) {
      this._sharedService
        .post(BaseURL.BASE_USER_ENDPOINT + "login", formData.value)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              localStorage.setItem("authToken", apiResponse.data.authToken);
              localStorage.setItem(
                "userId",
                apiResponse.data.userDetails.userId
              );
              localStorage.setItem("name", apiResponse.data.userDetails.name);
              this._router.navigate(["/dashboard"]);
            } else {
              this._toastr.errorToastr(apiResponse.message, "Error");
            }
          },
          (err) => {
            this._toastr.errorToastr(err.message, "Error");
          }
        );
    } else {
      this._toastr.errorToastr("Error Occured !!", "Login!");
    }
  }
}
