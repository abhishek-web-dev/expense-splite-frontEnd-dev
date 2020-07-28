import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CreateGroupPageComponent } from "../create-group-page/create-group-page.component";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";
import { ToastrManager } from "ng6-toastr-notifications";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit, OnDestroy {
  authToken: string;
  userId: string;
  userName: string;
  allGroups: any = [];

  // infinite scroll variable
  notScrolly: boolean = true;
  notEmptyPost: boolean = true;
  pageNo: number = 0;

  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    private _toastr: ToastrManager,
    private _spinner: NgxSpinnerService
  ) {
    this.authToken = localStorage.getItem("authToken");
    this.userId = localStorage.getItem("userId");
    this.userName = localStorage.getItem("name");
    this._spinner.show();
    // get ten groups
    this.getTenGroupFunction();
  }

  ngOnInit(): void {}

  // this method call when scroller go down
  onScroll() {
    if (this.notScrolly && this.notEmptyPost) {
      this._spinner.show();
      this.notScrolly = false;
      this.pageNo++;
      this.getTenGroupFunction();
    }
  }

  // this dialog for creation of new group
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateGroupPageComponent, {
      width: "400px",
      height: "300px",
    });

    // get data of dialog form
    dialogRef.afterClosed().subscribe((result) => {
      this.createGroupFunction(result);
    });
  }

  // request server to create new group
  createGroupFunction = (model: any) => {
    if (model !== undefined) {
      model.authToken = this.authToken;
      model.creatorName = this.userName;
      model.creatorId = this.userId;

      if (model.groupMemberIds == null) {
        model.groupMemberIds = [{ userId: this.userId, name: this.userName }];
      } else {
        model.groupMemberIds.push({ userId: this.userId, name: this.userName });
      }

      this._sharedService
        .post(BaseURL.BASE_USER_ENDPOINT + "create/group", model)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              this._toastr.successToastr(apiResponse.message, "Success");
              this.pageNo = 0;
              this.getTenGroupFunction();
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

  // get ten groups
  getTenGroupFunction = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/ten/groups", {
        authToken: this.authToken,
        skip: this.pageNo * 10,
        userId: this.userId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            const newPost = apiResponse.data;
            this._spinner.hide();
            if (newPost.length === 0) {
              this.notEmptyPost = false;
            }
            if (this.pageNo == 0) {
              this.allGroups = [];
            }
            // add newly fetched posts to the existing post
            this.allGroups = this.allGroups.concat(newPost);
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

  // free the space
  ngOnDestroy(): void {
    this.allGroups = null;
  }
}
