import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {CdkScrollableModule} from '@angular/cdk/scrolling';

const allMaterialModules = [
  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  ScrollingModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatBadgeModule,
  MatSelectModule,
  MatFormFieldModule,
  CdkScrollableModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    allMaterialModules
  ],
  exports: [
    allMaterialModules
  ]
})
export class MaterialModule { }
