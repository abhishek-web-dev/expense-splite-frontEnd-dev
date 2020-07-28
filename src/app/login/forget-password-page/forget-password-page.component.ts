import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { SharedService } from "src/app/shared/shared.service";
import { Router } from "@angular/router";
import { BaseURL } from "src/app/shared/base-url";

@Component({
  selector: "app-forget-password-page",
  templateUrl: "./forget-password-page.component.html",
  styleUrls: ["./forget-password-page.component.css"],
})
export class ForgetPasswordPageComponent implements OnInit {
  forgetForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrManager,
    private _sharedService: SharedService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.createForgetForm();
  }

  createForgetForm(): void {
    this.forgetForm = this._fb.group({
      code: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.forgetForm.reset();
  }

  // send reques to update password
  onSubmit(formData: any) {
    if (this.forgetForm.valid) {
      console.log(formData.value);
      this._sharedService
        .post(BaseURL.BASE_USER_ENDPOINT + "update/password", formData.value)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              this._toastr.successToastr(apiResponse.message, "Success");
              this._router.navigate(["/login"]);
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
