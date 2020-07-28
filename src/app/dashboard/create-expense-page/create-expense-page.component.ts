import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";

@Component({
  selector: "app-create-expense-page",
  templateUrl: "./create-expense-page.component.html",
  styleUrls: ["./create-expense-page.component.css"],
})
export class CreateExpensePageComponent implements OnInit, OnDestroy {
  createExpenseForm: FormGroup;
  contibuterFormArray: FormArray;
  distributerFormArray: FormArray;
  authToken: string;
  userId: string;
  dropValue1: string;
  dropValue2: string;
  groupId: string;

  constructor(
    public dialogRef: MatDialogRef<CreateExpensePageComponent>,
    private _fb: FormBuilder,
    private _toastr: ToastrManager,
    private _sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupId = data.groupId;
    this.authToken = localStorage.getItem("authToken");
    this.userId = localStorage.getItem("userId");
    this.getOneGroupDetailsFunction();
  }

  ngOnInit(): void {
    // initialize expense forms
    this.contibuterFormArray = this._fb.array([]);
    this.distributerFormArray = this._fb.array([]);
    this.createExpenseFormFunction();
  }

  // create expense form
  createExpenseFormFunction(): void {
    this.createExpenseForm = this._fb.group({
      selectContributer: [Validators.required],
      selectDistributer: [Validators.required],
      name: ["", Validators.required],
      amount: [""],
      contributer: this.contibuterFormArray,
      distributer: this.distributerFormArray,
    });
    this.createExpenseForm.reset();
  }

  // close dialog component
  onNoClick(): void {
    this.dialogRef.close();
  }

  // contributer form

  // select 1 dropdown
  selectfunction1(value) {
    this.dropValue1 = value;
  }

  get contributerform(): FormArray {
    return this.createExpenseForm.get("contributer") as FormArray;
  }

  // delete contributer from contributer list
  removeContributer(id: number) {
    this.contributerform.removeAt(id);
  }

  // distributer form

  // select 2 dropdown
  selectfunction2(value) {
    this.dropValue2 = value;
  }

  get distributerform(): FormArray {
    return this.createExpenseForm.get("distributer") as FormArray;
  }

  // request server to get one group details
  getOneGroupDetailsFunction = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/one/group", {
        authToken: this.authToken,
        groupId: this.groupId,
      })
      .subscribe(
        (apiResponse) => {
          apiResponse.data[0].groupMemberIds.forEach((item) => {
            this.contibuterFormArray.push(
              this._fb.group({
                userId: [item.userId, Validators.required],
                name: [item.name, Validators.required],
                amount: [0],
              })
            );

            this.distributerFormArray.push(
              this._fb.group({
                userId: [item.userId, Validators.required],
                name: [item.name, Validators.required],
                distributed: [false],
              })
            );
          });
          if (apiResponse.status !== 200) {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // free space
  ngOnDestroy(): void {}
}
