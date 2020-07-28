import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from "src/app/shared/shared.service";
import { ToastrManager } from "ng6-toastr-notifications";
import { NgxSpinnerService } from "ngx-spinner";
import { BaseURL } from "src/app/shared/base-url";
import { EditExpensePageComponent } from "../edit-expense-page/edit-expense-page.component";
import { Location } from "@angular/common";
import { SocketService } from "src/app/socket.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-view-expense-page",
  templateUrl: "./view-expense-page.component.html",
  styleUrls: ["./view-expense-page.component.css"],
})
export class ViewExpensePageComponent implements OnInit, OnDestroy {
  expenseId: string;
  groupId: string;
  authToken: string;
  userId: string;
  userName: string;
  expenseData: any = [];
  splitArray: any = [];
  splitArray2: any = [];
  pageNo: number = 0;
  allHistoryData: any = [];

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _sharedService: SharedService,
    private _toastr: ToastrManager,
    private _spinner: NgxSpinnerService,
    private _location: Location,
    private _socketService: SocketService
  ) {
    this.authToken = localStorage.getItem("authToken");
    this.userId = localStorage.getItem("userId");
    this.userName = localStorage.getItem("name");
    // get resolved data from router
    this.route.params.subscribe((params) => {
      this.expenseId = params.expenseId;
      this.groupId = params.groupId;
    });

    this._spinner.show();
    // get one expense data
    this.getOneExpenseFunction();
    // get ten history
    this.getTenHistory();
  }

  ngOnInit(): void {}

  // go to previous page
  goBack() {
    this._location.back();
  }

  // open edit expense form dialog
  openEditExpenseDialog(): void {
    const dialogRef = this.dialog.open(EditExpensePageComponent, {
      width: "700px",
      data: { groupId: this.groupId, expenseId: this.expenseId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.editExpenseFunction(result);
    });
  }

  // split balance function
  splitBalance = (data) => {
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

    this.splitArray = [...notPayArr];

    for (let i = 0; i < getArr.length; i++) {
      for (let j = 0; j < payArr.length; j++) {
        let paidAmount = getArr[i].amount - payArr[j].amount;
        if (
          paidAmount === 0 &&
          getArr[i].amount !== 0 &&
          payArr[j].amount !== 0
        ) {
          this.splitArray.push({
            payerName: payArr[j].name,
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
          this.splitArray.push({
            payerName: payArr[j].name,
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
          this.splitArray.push({
            payerName: payArr[j].name,
            reciverName: getArr[i].name,
            amount: getArr[i].amount,
          });
          getArr[i].amount = 0;
          payArr[j].amount = -paidAmount;
        }
      }
    }

    this.splitArray2 = this.splitArray;
    this.splitArray = [];
    payArr = null;
    notPayArr = null;
    getArr = null;
  }; //ending of splitBalance method

  // get one expense details
  getOneExpenseFunction = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/one/expense", {
        authToken: this.authToken,
        expenseId: this.expenseId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.expenseData = apiResponse.data;
            this.splitBalance(apiResponse.data[0]);
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

  // request server to edit expense
  editExpenseFunction = (model: any) => {
    if (model !== undefined) {
      let message = ``;
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

      // message for old and new controbuter
      model.contributer.map((item) => {
        let exp = this.expenseData[0].contributer;
        let newContributer = true;
        for (let i = 0; i < exp.length; i++) {
          if (item.userId === exp[i].userId) {
            newContributer = false;
            //  message for old contributer
            if (parseInt(item.amount) !== parseInt(exp[i].amount)) {
              if (message.length == 0) {
                message = message.concat(`${this.userName} has changed ${item.name} contribution from
                  ${exp[i].amount} to ${item.amount}`);
              } else {
                message = message.concat(
                  ` , `,
                  `${this.userName} has changed ${item.name} contribution from
                  ${exp[i].amount} to ${item.amount}`
                );
              }
            }
            break;
          }
        }

        // message for new contributer
        if (newContributer) {
          console.log(message);
          if (message.length == 0) {
            message = message.concat(
              `${this.userName} has added ${item.name} to contribute ${item.amount} rupeese`
            );
          } else {
            message = message.concat(
              ` , `,
              `${this.userName} has added ${item.name} to contribute ${item.amount} rupeese`
            );
          }
        }
      });

      // removed old contributer
      this.expenseData[0].contributer.map((item) => {
        let hasRemoved = true;
        for (let i = 0; i < model.contributer.length; i++) {
          if (item.userId === model.contributer[i].userId) {
            hasRemoved = false;
            break;
          }
        }

        // message for removed user from contribution
        if (hasRemoved) {
          if (message.length == 0) {
            message = message.concat(
              `${this.userName} has removed ${item.name} from contribution`
            );
          } else {
            message = message.concat(
              ` , `,
              `${this.userName} has removed ${item.name} from contribution`
            );
          }
        }
      });

      // if expense destributed equally
      if (model.selectDistributer === "distributeEqual" && errorOccur) {
        model.distributer.map((item) => {
          item.distributed = true;
        });
      }

      // message to remove from distribution
      this.expenseData[0].distributer.map((item) => {
        let hasRemoved = true;
        for (let i = 0; i < model.distributer.length; i++) {
          if (
            item.userId === model.distributer[i].userId &&
            model.distributer[i].distributed
          ) {
            hasRemoved = false;
            break;
          }
        }

        // message for removed user from distribution
        if (hasRemoved) {
          if (message.length == 0) {
            message = message.concat(
              `${this.userName} has removed ${item.name} from distribution`
            );
          } else {
            message = message.concat(
              ` , `,
              `${this.userName} has removed ${item.name} from distribution`
            );
          }
        }
      });

      // message to add in distribution
      model.distributer.map((item) => {
        let exp = this.expenseData[0].distributer;
        let newAdded = true;

        for (let i = 0; i < exp.length; i++) {
          if (item.userId === exp[i].userId && exp[i].distributed) {
            newAdded = false;
            break;
          }
        }

        if (newAdded) {
          if (message.length == 0) {
            message = message.concat(
              `${this.userName} has added to ${item.name} in distribution`
            );
          } else {
            message = message.concat(
              ` , `,
              `${this.userName} has added to ${item.name} in distribution`
            );
          }
        }
      });

      if (model.selectContributer == "paidByYou") {
        for (let i = 0; i < model.contributer.length; i++) {
          if (model.contributer[i].userId === this.userId) {
            model.contributer[i].amount = model.amount;
            break;
          }
        }
      }

      // change expense name
      if (this.expenseData[0].ename !== model.ename) {
        if (message.length == 0) {
          message = message.concat(
            `${this.userName} has changed the expense name from ${this.expenseData[0].ename} to ${model.ename}`
          );
        } else {
          message = message.concat(
            ` , `,
            `${this.userName} has changed the expense name from ${this.expenseData[0].ename} to ${model.ename}`
          );
        }
      }

      // change expense amount
      if (this.expenseData[0].amount !== model.amount) {
        if (message.length == 0) {
          message = message.concat(
            `${this.userName} has changed the expense amount from ${this.expenseData[0].amount} to ${model.amount}`
          );
        } else {
          message = message.concat(
            ` , `,
            `${this.userName} has changed the expense amount from ${this.expenseData[0].amount} to ${model.amount}`
          );
        }
      }

      model.authToken = this.authToken;
      model.expenseId = this.expenseId;
      model.message = message;
      model.updatedByName = this.userName;
      model.updatedById = this.userId;
      delete model.selectContributer;
      delete model.selectDistributer;

      if (message.length != 0) {
        this._socketService.updateExpense(model);
        this.pageNo = 0;
        this.getTenHistory();
        this.getOneExpenseFunction();
      } else {
        this._toastr.warningToastr(
          "You have not edited the expense!",
          "Warning"
        );
      }
    }
  };

  // get ten history
  getTenHistory = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/ten/history", {
        authToken: this.authToken,
        expenseId: this.expenseId,
        skip: this.pageNo * 10,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            if (this.pageNo == 0) {
              this.allHistoryData = [];
            }
            const newPost = apiResponse.data;
            // add newly fetched history to the existing history
            this.allHistoryData = this.allHistoryData.concat(newPost);
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // get 10 history on click
  getMoreHistory = () => {
    this.pageNo++;
    this.getTenHistory();
  };

  // delete expense
  deleteExpense = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Expense!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        //alert(result.value);

        let temp1 = [
          ...this.expenseData[0].contributer,
          ...this.expenseData[0].distributer,
        ];
        let temp2 = [];
        // get all userId to send email and notification
        for (let i = 0; i < temp1.length; i++) {
          for (let j = i + 1; j < temp1.length; j++) {
            if (temp1[i].userId == temp1[j].userId) {
              temp1.splice(j, 1);
              break;
            }
          }
          temp2.push(temp1[i].userId);
        }

        let deleteMessage = `${this.userName} has deleted ${this.expenseData[0].ename} Expense.`;
        let model = {
          expenseId: this.expenseId,
          userGetNotificationIds: temp2,
          message: deleteMessage,
          ename: this.expenseData[0].ename,
          updatedByName: this.userName,
        };

        this._socketService.deleteExpense(model);
        this.goBack();
      }
    });
  };

  // free memory space
  ngOnDestroy(): void {
    this.expenseData = null;
    this.splitArray = null;
    this.splitArray2 = null;
    this.allHistoryData = null;
  }
}
