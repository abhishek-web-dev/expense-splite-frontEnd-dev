import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './layout-page/layout-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { MomentModule } from 'ngx-moment';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [LayoutPageComponent, HeaderPageComponent],
  imports: [
    CommonModule,
    MomentModule,
    MaterialModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    HeaderPageComponent
    
  ]
})
export class SharedModule { }
