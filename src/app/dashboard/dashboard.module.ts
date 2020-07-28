import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { CreateGroupPageComponent } from './create-group-page/create-group-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { ViewGroupPageComponent } from './view-group-page/view-group-page.component';
import { CreateExpensePageComponent } from './create-expense-page/create-expense-page.component';
import { ViewExpensePageComponent } from './view-expense-page/view-expense-page.component';
import { EditGroupPageComponent } from './edit-group-page/edit-group-page.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditExpensePageComponent } from './edit-expense-page/edit-expense-page.component';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [
    PageNotFoundComponent,
     HomePageComponent, 
     CreateGroupPageComponent,
      ViewGroupPageComponent, 
      CreateExpensePageComponent, 
      ViewExpensePageComponent, 
      EditGroupPageComponent,
      EditExpensePageComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    MomentModule
  
  ],
  
})
export class DashboardModule { }
