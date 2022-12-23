import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {EProductsListMode, IGetProductsList, IProductFormOptions, IProductsListItem} from './products-list.model';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {takeUntil, tap} from 'rxjs/operators';
import {ProductsListLocalStorageService} from './products-list.ls-service';
import {ProductsListDataService} from './products-list.data-service';

@Component({
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  providers: [MessageService, ProductsListDataService, ProductsListLocalStorageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit, OnDestroy {
  productsListMode: EProductsListMode | null = null;
  productsListModeEnum: typeof EProductsListMode = EProductsListMode;
  products: Array<IProductsListItem> = [];
  itemsPerPage: number = 0;
  sortField: {field: string, order: 'asc' | 'desc'} = {field: '', order: 'asc'};
  totalItems: number = 0;
  firstItem: number = 0;
  private readonly destroy$: Subject<void> = new Subject();
  productFormOptions: IProductFormOptions = {header: ''};
  visibleProductForm: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: ProductsListDataService,
    private lsService: ProductsListLocalStorageService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listenRouter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProductsLazy(event: LazyLoadEvent): void {
    this.router.navigate([], {
      queryParams: { first: event.first, limit: event.rows, sort: event.sortField, 'order': (event.sortOrder || 1) < 0 ? 'desc' : 'asc' },
      queryParamsHandling: 'merge'
    });
  }

  private listenRouter(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params: Params) => {
          if (this.isLegalMode(params['mode'])) {
            this.productsListMode = params['mode'];
            this.refreshProductsList();
          } else {
            this.router.navigate(['/page404']);
          }
        }
      });
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params: Params) => {
          if (+params['limit'] === 0) {
            this.router.navigate([], {queryParams: { limit: 10}, queryParamsHandling: 'merge'});
          } else if (!params['sort']) {
            this.router.navigate([], {queryParams: { sort: 'title'}, queryParamsHandling: 'merge'});
          }
          else {
            if (!isNaN(+params['first']) && !isNaN(+params['limit']) &&
              ['title', 'brand', 'category', 'price'].find(s => s === params['sort']) &&
              ['asc', 'desc'].find(s => s === params['order'])) {
                this.firstItem = +params['first'];
                this.itemsPerPage = +params['limit'];
                this.sortField = {field: params['sort'], order: params['order']}
                this.refreshProductsList();
              }
            }
        }
      });
  }

  private refreshProductsList(): void {
    if (!this.productsListMode || !this.itemsPerPage) return;
    this.dataService.getProducts(this.firstItem, this.itemsPerPage, this.sortField)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IGetProductsList) => {
          this.products = [...response.products];
          this.totalItems = response.total;
          const selectedList: Array<number> = this.lsService.getSelectedList();
          this.products.forEach(p => p.isSelected = selectedList.some(id => p.id === id));
          this.changeDetectorRef.detectChanges();
        },
        error: () => alert('Cann\'t read product list')
      });
  }

  private isLegalMode(mode: string): boolean {
    if (!mode) return true;
    const legalValues: Array<string> = Object.values(this.productsListModeEnum);
    return !!legalValues.find(v => v === mode);
  }

  changeProductSelected(product: IProductsListItem, state: {checked: boolean}) {
    product.isSelected = state.checked;
    this.lsService.updateSelectedListById(product.id, product.isSelected);
    const textMessage = 'The product has been successfully ' +
      (product.isSelected ? 'added to your favorites' : 'removed from the saved');
    this.messageService.add({key: 'bc', severity:'info', summary: '', detail: textMessage, life: 2500});
  }

  addProductClick(): void {
    this.productFormOptions = {header: `New product`};
    this.visibleProductForm = true;
    this.changeDetectorRef.detectChanges();
  }

  editProductClick(product: IProductsListItem): void {
    this.productFormOptions = {product, header: `Edit product ${product.title}`};
    this.visibleProductForm = true;
    this.changeDetectorRef.detectChanges();
  }

  saveProduct(product: IProductsListItem): void {
    const obs: Observable<void> = !!product.id
      ? this.dataService.patchProduct(product.id, product)
      : this.dataService.postProduct(product);
    obs.pipe(
      tap(() => this.refreshProductsList())
    ).subscribe({
      next: () => this.hideDialog(),
      error: () => alert('Cann\'t post or put product')
    })
  }

  hideDialog(): void {
    if (this.visibleProductForm) {
      this.visibleProductForm = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  deleteProductClick(product: IProductsListItem): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected product?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      key: 'deleteProductDialog',
      accept: () => this.deleteProduct(product.id)
    });
  }

  private deleteProduct(id: number): void {
    this.dataService.deleteProduct(id)
      .pipe(
        tap(() => {
          if (this.products.length > 1) this.refreshProductsList();
          else {
            let newFirstItem: number = this.firstItem - this.itemsPerPage;
            if (newFirstItem < 0) newFirstItem = 0;
            this.router.navigate([], {
              queryParams: {
                first: newFirstItem,
                limit: this.itemsPerPage,
                sort: this.sortField.field,
                order: this.sortField.order
              },
              queryParamsHandling: 'merge'
            })
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: () => alert('Cann\'t delete product')
      });
  }

  setImageClick(product: IProductsListItem): void {
    alert('Ничего не понятно, что делать.\nНи в доке сервера ни в задании ни слова про Base64, например.\n' +
      'Как отдавать "серверу" контент выбранного файла?\n' +
      'Роуты в API есть, но в боди только джейсон с именем файла...\n' +
      'Я для приаттачивания картинки выберу файл использовав input cоответствующего типа и с hidden-стилем, затем прочитаю контент, а дальше ? ')
  }
}
