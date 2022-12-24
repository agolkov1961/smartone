import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {EProductsListMode, IGetProductsList, IProductsListItem} from '../products-list.model';
import {HttpService} from '../../../services/http.service';
import {ProductsListLocalStorageService} from './products-list.ls-service';


@Injectable()
export class ProductsListDataService {

  constructor(
    private httpService: HttpService,
    private lsService: ProductsListLocalStorageService
  ) { }

  getProducts(mode: EProductsListMode, firstItem: number, itemsPerPage: number, sortField: { field: string, order: 'asc' | 'desc' }): Observable<IGetProductsList> {
    const order: string = sortField.order === 'desc' ? '-' : '';
    const selectedList: Array<number> = this.lsService.getSelectedList();
    if (mode === EProductsListMode.All) {
      return this.httpService.get(`products?limit=${itemsPerPage}&skip=${firstItem}&ordering=${order}${sortField.field}`)
        .pipe(
          map((response: IGetProductsList) => ({
            ...response,
            products: response.products.map(p => ({...p, isSelected: selectedList.some(id => p.id === id)}))
          })),
        );
    } else {
      return this.httpService.get(`products?limit=0&skip=0&ordering=${order}${sortField.field}`)
        .pipe(
          map((response: IGetProductsList) => ({
            ...response,
            products: response.products.filter(p => selectedList.some(id => p.id === id))
          })),
          map((response: IGetProductsList) => ({
            ...response,
            total: response.products.length
          })),
          map((response: IGetProductsList) => ({
            ...response,
            products: response.products.slice(firstItem, itemsPerPage)
          }))
        )
    }
  }

  updateSelectedListById(id: number, isSelected: boolean): void {
    this.lsService.updateSelectedListById(id, isSelected);
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

  setProductImage(id: number, file: File): Observable<void> {       // !!!!!!!!!!!!!!
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpService.post(`product/${id}/image`, formData);
  }
}
