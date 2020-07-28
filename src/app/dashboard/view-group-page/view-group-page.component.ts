import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { CreateExpensePageComponent } from "../create-expense-page/create-expense-page.component";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";
import { ToastrManager } from "ng6-toastr-notifications";
import { NgxSpinnerService } from "ngx-spinner";
import { EditGroupPageComponent } from "../edit-group-page/edit-group-page.component";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-view-group-page",
  templateUrl: "./view-group-page.component.html",
  styleUrls: ["./view-group-page.component.css"],
})
export class ViewGroupPageComponent implements OnInit, OnDestroy {
  groupId: string;
  groupName: string;
  authToken: string;
  userId: string;
  userName: string;
  allExpense: any = [];

  // split balance variable
  splitArray: any = [];

  // chat variables
  chatPageNo: number = 0;
  allMessageData: any = [];
  commentForm: FormGroup;

  // infinite scroll variables
  notScrolly: boolean = true;
  notEmptyPost: boolean = true;
  pageNo: number = 0;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _sharedService: SharedService,
    private _toastr: ToastrManager,
    private _spinner: NgxSpinnerService,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    this.authToken = localStorage.getItem("authToken");
    this.userId = localStorage.getItem("userId");
    this.userName = localStorage.getItem("name");
    // get resolved data from router
    this.route.params.subscribe((params) => {
      this.groupId = params.groupId;
    });

    this._spinner.show();
    // get ten expenses
    this.getTenExpenseFunction();

    // get all expense
    this.getAllExpenseFunction();

    // get ten message
    this.getTenMessages();

    // get one group details
    this.getOneGroupDetailsFunction();
  }

  ngOnInit(): void {
    // initializing coment form
    this.createCommentForm();
  }

  // this method call when scroller go down
  onScroll() {
    if (this.notScrolly && this.notEmptyPost) {
      this._spinner.show();
      this.notScrolly = false;
      this.pageNo++;
      this.getTenExpenseFunction();
    }
  }

  // open create expense form dialog
  openCreateExpenseDialog(): void {
    const dialogRef = this.dialog.open(CreateExpensePageComponent, {
      width: "700px",
      data: { groupId: this.groupId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.createExpenseFunction(result);
    });
  }

  // request server to create new expense
  createExpenseFunction = (model: any) => {
    if (model !== undefined) {
      let errorOccur = true;

      if (
        model.selectDistributer === null ||
        model.selectContributer === null
      ) {
        errorOccur = false;
        this._toastr.warningToastr(
          "Please select 'Expense payed by' and 'Expense distributed'",
          "Warning"
        );
        return;
      }
      // expense paid by multiple people
      if (model.selectContributer === "paidByMultiple") {
        let total: number = 0;
        model.contributer.map((item) => {
          total = total + parseInt(item.amount);
        });
        if (total !== parseInt(model.amount)) {
          errorOccur = false;
          this._toastr.warningToastr(
            "Please enter correct expenditure and contribution amount!",
            "Warning"
          );
          return;
        }
      }

      // if expense destributed equally
      if (model.selectDistributer === "distributeEqual" && errorOccur) {
        model.distributer.map((item) => {
          item.distributed = true;
        });
      }

      if (model.selectContributer == "paidByYou") {
        for (let i = 0; i < model.contributer.length; i++) {
          if (model.contributer[i].userId === this.userId) {
            model.contributer[i].amount = model.amount;
            break;
          }
        }
      }

      model.authToken = this.authToken;
      model.creatorName = this.userName;
      model.creatorId = this.userId;
      model.groupId = this.groupId;
      model.updatedByName = this.userName;
      model.updatedById = this.userId;
      delete model.selectContributer;
      delete model.selectDistributer;

      this._sharedService
        .post(BaseURL.BASE_USER_ENDPOINT + "create/expense", model)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              this._toastr.successToastr(apiResponse.message, "Success");

              if (this.allExpense.length <= this.pageNo * 10 + 10) {
                this.allExpense.push(apiResponse.data);
              } else {
                this.pageNo = 0;
                this.allExpense = [];
                this.getTenExpenseFunction();
              }
              // calculate split balance
              this.getAllExpenseFunction();
            } else {
              this._toastr.errorToastr(apiResponse.message, "Error");
            }
          },
          (err) => {
            this._toastr.errorToastr(err.message, "Error");
          }
        );
    }
  };

  // get ten expense
  getTenExpenseFunction = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/ten/expenses", {
        authToken: this.authToken,
        skip: this.pageNo * 10,
        groupId: this.groupId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            const newPost = apiResponse.data;
            this._spinner.hide();
            if (newPost.length === 0) {
              this.notEmptyPost = false;
            }
            // add newly fetched posts to the existing post
            this.allExpense = this.allExpense.concat(newPost);
            this.notScrolly = true;
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

  // get all expenses
  getAllExpenseFunction = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/all/expenses", {
        authToken: this.authToken,
        groupId: this.groupId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this._spinner.hide();
            let temp = [];
            apiResponse.data.map((item) => {
              temp = [...temp, ...this.splitBalance(item)];
            });

            // split group balance equally
            for (let i = 0; i < temp.length; i++) {
              for (let j = i + 1; j < temp.length; j++) {
                if (
                  temp[i].payerUserId == temp[j].payerUserId &&
                  temp[i].reciverUserId == temp[j].reciverUserId
                ) {
                  temp[i].amount =
                    parseInt(temp[i].amount) + parseInt(temp[j].amount);
                  temp.splice(j, 1);
                  j = j - 1;
                  i = i - 1;
                  break;
                }

                if (
                  temp[i].payerUserId == temp[j].reciverUserId &&
                  temp[i].reciverUserId == temp[j].payerUserId
                ) {
                  if (parseInt(temp[i].amount) < parseInt(temp[j].amount)) {
                    temp[j].amount =
                      parseInt(temp[j].amount) - parseInt(temp[i].amount);
                    temp.splice(i, 1);
                    i = i - 1;
                    break;
                  } else {
                    temp[i].amount =
                      parseInt(temp[i].amount) - parseInt(temp[j].amount);
                    temp.splice(j, 1);
                    j = j - 1;
                  }
                }
              }
            }

            this.splitArray = temp;
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

  // this dialog for edit group
  openEditGroupDialog(): void {
    this._spinner.hide();
    const dialogRef = this.dialog.open(EditGroupPageComponent, {
      width: "400px",
      height: "500px",
      data: { groupId: this.groupId },
    });

    // get data of dialog form
    dialogRef.afterClosed().subscribe((result) => {
      this.editGroupFunction(result);
    });
  }

  // edit group
  editGroupFunction = (model: any) => {
    if (model !== undefined) {
      model.authToken = this.authToken;
      model.groupId = this.groupId;

      if (model.groupMemberIds == null) {
        model.groupMemberIds = [{ userId: this.userId, name: this.userName }];
      } else {
        model.groupMemberIds.push({ userId: this.userId, name: this.userName });
      }

      this._sharedService
        .post(BaseURL.BASE_USER_ENDPOINT + "edit/group", model)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              this._toastr.successToastr(apiResponse.message, "Success");
              this.getOneGroupDetailsFunction();
            } else {
              this._toastr.errorToastr(apiResponse.message, "Error");
            }
          },
          (err) => {
            this._toastr.errorToastr(err.message, "Error");
          }
        );
    }
  };

  // split balance function
  splitBalance = (data): any => {
    let distributer = data.distributer;
    let contributer = data.contributer;
    let total = parseInt(data.amount);
    let payerNo = 0;
    let avgPerPerson = 0;
    let payArr = [];
    let notPayArr = [];
    let getArr = [];
    let tempArra = [];

    // find total no. of contributer
    for (let i = 0; i < distributer.length; i++) {
      if (distributer[i].distributed === true) {
        payerNo++;
        tempArra.push(distributer[i]);
      }
    }

    distributer = tempArra;
    tempArra = null;

    // per person avg
    avgPerPerson = parseFloat((total / payerNo).toFixed(2));

    distributer.map((distItem) => {
      let notPresentContributer = true;
      for (let i = 0; i < contributer.length; i++) {
        if (distItem.userId === contributer[i].userId) {
          notPresentContributer = false;
          let totalAmount = avgPerPerson - parseInt(contributer[i].amount);
          if (totalAmount === 0) {
            notPayArr.push({
              userId: distItem.userId,
              name: distItem.name,
              amount: 0,
            });
            break;
          } else if (totalAmount > 0) {
            payArr.push({
              userId: distItem.userId,
              name: distItem.name,
              amount: totalAmount,
            });
            break;
          } else {
            getArr.push({
              userId: distItem.userId,
              name: distItem.name,
              amount: -totalAmount,
            });
            break;
          }
        }
      }

      if (notPresentContributer) {
        payArr.push({
          userId: distItem.userId,
          name: distItem.name,
          amount: avgPerPerson,
        });
      }
    });

    contributer.map((item1) => {
      let itemMatched = false;

      for (let i = 0; i < distributer.length; i++) {
        if (item1.userId === distributer[i].userId) {
          itemMatched = true;
          break;
        }
      }

      if (!itemMatched) {
        getArr.push({
          userId: item1.userId,
          name: item1.name,
          amount: item1.amount,
        });
      }
    });

    let splitArray = [];

    for (let i = 0; i < getArr.length; i++) {
      for (let j = 0; j < payArr.length; j++) {
        let paidAmount = getArr[i].amount - payArr[j].amount;
        if (
          paidAmount === 0 &&
          getArr[i].amount !== 0 &&
          payArr[j].amount !== 0
        ) {
          splitArray.push({
            payerName: payArr[j].name,
            payerUserId: payArr[j].userId,
            reciverUserId: getArr[i].userId,
            reciverName: getArr[i].name,
            amount: payArr[j].amount,
          });
          getArr[i].amount = 0;
          payArr[j].amount = 0;
        } else if (
          paidAmount > 0 &&
          getArr[i].amount !== 0 &&
          payArr[j].amount !== 0
        ) {
          splitArray.push({
            payerName: payArr[j].name,
            payerUserId: payArr[j].userId,
            reciverUserId: getArr[i].userId,
            reciverName: getArr[i].name,
            amount: payArr[j].amount,
          });

          getArr[i].amount = paidAmount;
          payArr[j].amount = 0;
        } else if (
          paidAmount < 0 &&
          getArr[i].amount !== 0 &&
          payArr[j].amount !== 0
        ) {
          splitArray.push({
            payerName: payArr[j].name,
            payerUserId: payArr[j].userId,
            reciverUserId: getArr[i].userId,
            reciverName: getArr[i].name,
            amount: getArr[i].amount,
          });
          getArr[i].amount = 0;
          payArr[j].amount = -paidAmount;
        }
      }
    }

    payArr = null;
    notPayArr = null;
    getArr = null;
    return splitArray;
  }; //ending of splitBalance method

  /* all chat related code started */

  // initialize comment form
  createCommentForm(): void {
    this.commentForm = this._fb.group({
      message: ["", Validators.required],
    });
    this.commentForm.reset();
  }

  // get 10 message on click
  getMoreData = () => {
    this.chatPageNo++;
    this.getTenMessages();
  };

  // get ten messages
  getTenMessages = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/ten/message", {
        authToken: this.authToken,
        groupId: this.groupId,
        skip: this.chatPageNo * 10,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            if (this.chatPageNo == 0) {
              this.allMessageData = [];
            }
            const newPost = apiResponse.data;
            // add newly fetched posts to the existing post
            this.allMessageData = this.allMessageData.concat(newPost);
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // create a new comment
  onComment(formData: any) {
    let model = {
      authToken: this.authToken,
      message: formData.value.message,
      groupId: this.groupId,
      senderName: this.userName,
      senderId: this.userId,
    };
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "create/message", model)
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            // this code save to make unnecessary server request
            if (
              this.allMessageData.length <= this.chatPageNo * 10 ||
              this.chatPageNo == 0
            ) {
              this.allMessageData = [apiResponse.data, ...this.allMessageData];
            } else {
              this.chatPageNo = 0;
              this.allMessageData = [];
              this.getTenMessages();
            }
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
    this.commentForm.reset();
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
          if (apiResponse.status === 200) {
            this.groupName = apiResponse.data[0].gname;
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // delete group
  deleteGroup = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Group!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this._sharedService
          .post(BaseURL.BASE_USER_ENDPOINT + "delete/group", {
            authToken: this.authToken,
            groupId: this.groupId,
          })
          .subscribe(
            (apiResponse) => {
              if (apiResponse.status === 200) {
                Swal.fire(
                  "Deleted!",
                  "Your Group has been deleted.",
                  "success"
                );
                this._router.navigate(["/dashboard"]);
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
              }
            },
            (err) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          );
      }
    });
  };

  // free memory space
  ngOnDestroy(): void {
    this.allExpense = null;
    this.splitArray = null;
    this.allMessageData = null;
  }
}
