import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { BaseURL } from "src/app/shared/base-url";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrManager } from "ng6-toastr-notifications";
import { SharedService } from "src/app/shared/shared.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { NgxSpinnerService } from "ngx-spinner";

interface userData {
  name: string;
  userId: string;
}

@Component({
  selector: "app-edit-group-page",
  templateUrl: "./edit-group-page.component.html",
  styleUrls: ["./edit-group-page.component.css"],
})
export class EditGroupPageComponent implements OnInit, OnDestroy {
  // dropdown var
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;

  editGroupForm: FormGroup;
  authToken: string;
  allUserDetails: userData[];
  userId: string;
  groupId: string;
  oneGroupData: any;

  constructor(
    public dialogRef: MatDialogRef<EditGroupPageComponent>,
    private _fb: FormBuilder,
    private _toastr: ToastrManager,
    private _sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _spinner: NgxSpinnerService
  ) {
    this.groupId = data.groupId;
    this.authToken = localStorage.getItem("authToken");
    this.userId = localStorage.getItem("userId");
    _spinner.show();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // default dropdown setting
    this.dropdownSettings = {
      singleSelection: false,
      idField: "userId",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.editGroupFormFunction();
    // get one group details
    this.getOneGroupDetailsFunction();
  }

  // edit group form
  editGroupFormFunction(): void {
    this.editGroupForm = this._fb.group({
      gname: ["", Validators.required],
      groupMemberIds: [""],
    });
    this.editGroupForm.reset();
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
            // default selected user
            for (let i = 0; i < this.allUserDetails.length; i++) {
              if (this.allUserDetails[i].userId !== this.userId) {
                this.oneGroupData[0].groupMemberIds.map((item) => {
                  if (item.userId === this.allUserDetails[i].userId) {
                    this.selectedItems.push(this.allUserDetails[i]);
                  }
                });
              } else {
                this.allUserDetails.splice(i, 1);
                i = i - 1;
              }
            }
            this.dropdownList = this.allUserDetails;
            this.editGroupForm.patchValue({
              gname: this.oneGroupData[0].gname,
            });
            this._spinner.hide();
          } else {
            this._spinner.hide();
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // request server to get one group details
  getOneGroupDetailsFunction = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/one/group", {
        authToken: this.authToken,
        groupId: this.groupId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.oneGroupData = apiResponse.data;
            this.getAllUsersFunction();
          } else {
            this._spinner.hide();
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
    this.dropdownList = null;
    this.selectedItems = null;
  }
}
