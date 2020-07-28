import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { ToastrManager } from "ng6-toastr-notifications";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private toastr: ToastrManager, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let token = localStorage.getItem("authToken");

    if (token === undefined || token === "" || token === null) {
      this.toastr.errorToastr("You are not loged in!", "Error");
      this.router.navigate(["/"]);
      return false;
    } else {
      return true;
    }
  }
}
