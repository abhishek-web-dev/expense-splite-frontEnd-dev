import { Injectable } from "@angular/core";
import * as io from "socket.io-client";

import { Observable } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  // production
  private url = "http://api.expense.abhiweb.xyz/expense";

  // development
  //private url = "http://localhost:3000/expense";

  private socket;

  constructor(public http: HttpClient) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);
  }

  // get expense notification
  public getNotificationByUserId = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
  };

  // this will update expense
  public updateExpense = (expenseObject) => {
    this.socket.emit("expense-update", expenseObject);
  };

  // this will delete expense
  public deleteExpense = (model) => {
    this.socket.emit("expense-delete", model);
  };

  // close socket
  public exitSocket = () => {
    this.socket.disconnect();
  }; // end exit socket

}
