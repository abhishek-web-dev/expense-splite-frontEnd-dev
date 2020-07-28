import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from "../shared.service";
import { ToastrManager } from "ng6-toastr-notifications";
import { BaseURL } from "../base-url";
import { SocketService } from "src/app/socket.service";

@Component({
  selector: "app-header-page",
  templateUrl: "./header-page.component.html",
  styleUrls: ["./header-page.component.css"],
})
export class HeaderPageComponent implements OnInit {
  authToken: string;
  userName: String;
  userId: string;
  collapsed = true;
  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    private _toastr: ToastrManager,
    private _socketService: SocketService
  ) {
    this.userId = localStorage.getItem("userId");
    this.authToken = localStorage.getItem("authToken");
  }

  ngOnInit(): void {
    this.userName =
      localStorage.getItem("name").charAt(0).toUpperCase() +
      localStorage.getItem("name").slice(1);
    // get real-time expense update/delete notification message
    this.getNotificationFromAUser();
  }

  // logout method
  logout = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "logout", {
        authToken: this.authToken,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this._socketService.exitSocket();
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");
            localStorage.clear();
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // get real-time notification while expense update
  public getNotificationFromAUser: any = () => {
    this._socketService
      .getNotificationByUserId(this.userId)
      .subscribe((data) => {
        this._toastr.successToastr(data.message, "Success");
      }); //end subscribe
  }; // end get message from a user
}
