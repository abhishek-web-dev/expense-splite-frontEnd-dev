import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";

interface userData {
  name: string;
  userId: string;
}

@Component({
  selector: "app-create-group-page",
  templateUrl: "./create-group-page.component.html",
  styleUrls: ["./create-group-page.component.css"],
})
export class CreateGroupPageComponent implements OnInit, OnDestroy {
  createGroupForm: FormGroup;
  authToken: string;
  allUserDetails: userData[];
  userId: string;

  constructor(
    public dialogRef: MatDialogRef<CreateGroupPageComponent>,
    private _fb: FormBuilder,
    private _toastr: ToastrManager,
    private _sharedService: SharedService
  ) {
    this.authToken = localStorage.getItem("authToken");
    this.userId = localStorage.getItem("userId");
    // get all user details
    this.getAllUsersFunction();
  }

  // close dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.createGroupFormFunction();
  }

  createGroupFormFunction(): void {
    this.createGroupForm = this._fb.group({
      gname: ["", Validators.required],
      groupMemberIds: [""],
    });
    this.createGroupForm.reset();
  }

  // request server to get all user details
  getAllUsersFunction = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/all/user", {
        authToken: this.authToken,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.allUserDetails = apiResponse.data;
            // deleting userId from all user details
            for (let i = 0; i < this.allUserDetails.length; i++) {
              if (this.allUserDetails[i].userId == this.userId) {
                this.allUserDetails.splice(i, 1);
                break;
              }
            }
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // free memory space
  ngOnDestroy(): void {
    this.allUserDetails = null;
  }
}
