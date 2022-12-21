import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductsListComponent} from './products-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: 'all',
    component: ProductsListComponent,
  },
  {
    path: 'selected',
    component: ProductsListComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ProductsListRoutingModule { }
