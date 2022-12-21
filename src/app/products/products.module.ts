import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ProductsSidebarModule } from './sidebar/sidebar.module';
import { ButtonModule } from 'primeng/button';
import { ProductsRoutingModule } from './products-routing.module';



@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ProductsSidebarModule,
    ButtonModule
  ],
  exports: [
    ProductsComponent
  ],

})
export class ProductsModule { }
