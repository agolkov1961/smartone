import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: 'all',
    loadChildren: () => import('./products-list/products-list.module').then((m) => m.ProductsListModule),
  },
  {
    path: 'selected',
    loadChildren: () => import('./products-list/products-list.module').then((m) => m.ProductsListModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
