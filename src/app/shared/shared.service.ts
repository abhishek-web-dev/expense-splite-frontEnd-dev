import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  constructor(private _httpClient: HttpClient) {}

  // send request to server to perform create,edit,delete,read operation
  post(url: string, model: any): Observable<any> {
    const body = JSON.stringify(model);
    let httpHeaders = new HttpHeaders().set("content-Type", "application/json");
    let options = {
      headers: httpHeaders,
    };
    return this._httpClient.post(url, body, options);
  }
}
