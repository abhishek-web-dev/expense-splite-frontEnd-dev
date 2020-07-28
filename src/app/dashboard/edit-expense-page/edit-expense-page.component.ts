import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrManager } from "ng6-toastr-notifications";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";

@Component({
  selector: "app-edit-expense-page",
  templateUrl: "./edit-expense-page.component.html",
  styleUrls: ["./edit-expense-page.component.css"],
})
export class EditExpensePageComponent implements OnInit, OnDestroy {
  editExpenseForm: FormGroup;
  contibuterFormArray: FormArray;
  distributerFormArray: FormArray;
  authToken: string;
  userId: string;
  dropValue1: string;
  dropValue2: string;
  groupId: string;
  expenseId: string;

  constructor(
    public dialogRef: MatDialogRef<EditExpensePageComponent>,
    private _fb: FormBuilder,
    private _toastr: ToastrManager,
    private _sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupId = data.groupId;
    this.expenseId = data.expenseId;
    this.authToken = localStorage.getItem("authToken");
    this.userId = localStorage.getItem("userId");
    this.getOneGroupDetailsFunction();
  }

  ngOnInit(): void {
    // initialize expense forms
    this.contibuterFormArray = this._fb.array([]);
    this.distributerFormArray = this._fb.array([]);
    this.editExpenseFormFunction();
  }

  // edit expense form
  editExpenseFormFunction(): void {
    this.editExpenseForm = this._fb.group({
      selectContributer: [Validators.required],
      selectDistributer: [Validators.required],
      ename: ["", Validators.required],
      amount: [""],
      contributer: this.contibuterFormArray,
      distributer: this.distributerFormArray,
    });
    this.editExpenseForm.reset();
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
    return this.editExpenseForm.get("contributer") as FormArray;
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
    return this.editExpenseForm.get("distributer") as FormArray;
  }

  // get one expense details
  getOneExpenseFunction = (data) => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/one/expense", {
        authToken: this.authToken,
        expenseId: this.expenseId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            let oneExpenseDetails = apiResponse.data[0];
            data.groupMemberIds.forEach((item) => {
              let newContributer = true;
              // for contributer
              oneExpenseDetails.contributer.map((item1) => {
                if (item1.userId == item.userId) {
                  newContributer = false;
                  this.contibuterFormArray.push(
                    this._fb.group({
                      userId: [item.userId, Validators.required],
                      name: [item.name, Validators.required],
                      amount: [item1.amount],
                    })
                  );
                }
              });

              // add new contributer
              if (newContributer) {
                this.contibuterFormArray.push(
                  this._fb.group({
                    userId: [item.userId, Validators.required],
                    name: [item.name, Validators.required],
                    amount: [0],
                  })
                );
              }

              let newDistributer = true;
              // for distributer
              oneExpenseDetails.distributer.map((item1) => {
                if (item1.userId == item.userId) {
                  newDistributer = false;
                  this.distributerFormArray.push(
                    this._fb.group({
                      userId: [item.userId, Validators.required],
                      name: [item.name, Validators.required],
                      distributed: [item1.distributed],
                    })
                  );
                }
              });

              // add new distributer
              if (newDistributer) {
                this.distributerFormArray.push(
                  this._fb.group({
                    userId: [item.userId, Validators.required],
                    name: [item.name, Validators.required],
                    distributed: [false],
                  })
                );
              }
            });
            // update previous expense data
            this.editExpenseForm.patchValue({
              ename: oneExpenseDetails.ename,
              amount: oneExpenseDetails.amount,
            });
          } else {
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
          if (apiResponse.status == 200) {
            this.getOneExpenseFunction(apiResponse.data[0]);
          } else {
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
