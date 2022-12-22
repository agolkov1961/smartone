import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component';
import { TableModule } from 'primeng/table';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    OverlayPanelModule,
    ButtonModule
  ],
  exports: [ProductsListComponent]
})
export class ProductsListModule { }
