import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [
    ProductsSidebarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProductsSidebarComponent
  ]
})
export class ProductsSidebarModule { }
