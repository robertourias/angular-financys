import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FormFieldsErrorComponent } from './components/form-fields-error/form-fields-error.component';


@NgModule({
  declarations: [BreadcrumbComponent, PageHeaderComponent, FormFieldsErrorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    // shared modules
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    RouterModule,
    PageHeaderComponent,
    FormFieldsErrorComponent,
  ]
})
export class SharedModule { }
