import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {IGetProductsList, IProductsListItem} from './products-list.model';
import {HttpService} from '../../services/http.service';

@Injectable()
export class ProductsListDataService {

  constructor(private httpService: HttpService) { }

  getProducts(firstItem: number, itemsPerPage: number, sortField: {field: string, order: 'asc' | 'desc'}): Observable<IGetProductsList> {
    const order: string = sortField.order === 'desc' ? '-' : '';
    return this.httpService.get(`products?limit=${itemsPerPage}&skip=${firstItem}&ordering=${order}${sortField.field}`);
  }

  postProduct(body: IProductsListItem): Observable<void> {
    return this.httpService.post(`product`, body);
  }

  patchProduct(id: number, body: IProductsListItem): Observable<void> {
    return this.httpService.patch(`product/${id}`, body);
  }

  deleteProduct(id: number): Observable<void> {
    return this.httpService.delete(`product/${id}`);
  }
}
