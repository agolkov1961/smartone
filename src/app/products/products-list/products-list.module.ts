import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [ProductsListComponent]
})
export class ProductsListModule { }
