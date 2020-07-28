import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-login-page',
  templateUrl: './layout-login-page.component.html',
  styleUrls: ['./layout-login-page.component.css']
})
export class LayoutLoginPageComponent implements OnInit {

  collapsed = true;
  constructor() { }

  ngOnInit(): void {
  }

}
