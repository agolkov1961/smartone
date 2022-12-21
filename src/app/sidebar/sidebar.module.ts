import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSidebarComponent } from './sidebar.component';
import {PanelMenuModule} from 'primeng/panelmenu';

@NgModule({
  declarations: [
    ProductsSidebarComponent
  ],
  imports: [
    CommonModule,
    PanelMenuModule
  ],
  exports: [
    ProductsSidebarComponent
  ]
})
export class ProductsSidebarModule { }
