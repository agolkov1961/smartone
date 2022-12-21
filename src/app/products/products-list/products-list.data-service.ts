import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {IGetProductsList, IProductsListItem} from './products-list.model';
import {HttpService} from '../../services/http.service';

@Injectable()
export class ProductsListDataService {

  constructor(private httpService: HttpService) { }

  getProducts(page: number, itemsPerPage: number): Observable<IGetProductsList> {
    return this.httpService.get(`products?limit=${itemsPerPage}&skip=${page * itemsPerPage}&ordering=-id`);
  }
}
