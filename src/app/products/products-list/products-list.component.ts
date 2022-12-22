import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {EProductsListMode, IGetProductsList, IProductsListItem} from './products-list.model';
import {ProductsListDataService} from './products-list.data-service';
import {LazyLoadEvent} from 'primeng/api';

@Component({
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  providers: [ProductsListDataService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit, OnDestroy {
  productsListMode: EProductsListMode | null = null;
  productsListModeEnum: typeof EProductsListMode = EProductsListMode;
  products: Array<IProductsListItem> = [];
  itemsPerPage: number = 10;
  totalItems: number = 0;
  firstItem: number = 0;
  // actionProductItems: Array<MenuItem> = [
  //   {
  //     label: 'Edit',
  //     icon:'pi pi-fw pi-pencil',
  //     command: this.editItemClick.bind(this)
  //   },
  //   {
  //     label: 'Delete',
  //     icon:'pi pi-fw pi-trash'
  //   },
  //   {
  //     label: 'Set image',
  //     icon:'pi pi-fw pi-image'
  //   }
  // ];
  private readonly destroy$: Subject<void> = new Subject();
  private sortField: {field: string, order: 'asc' | 'desc'} = {field: 'title', order: 'asc'};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: ProductsListDataService,
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
    console.log(event);
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
          if (!isNaN(+params['first']) && !isNaN(+params['limit']) &&
            ['title', 'brand', 'category', 'price'].find(s => s === params['sort']) &&
            ['asc', 'desc'].find(s => s === params['order'])) {
            this.firstItem = +params['first'];
            this.itemsPerPage = +params['limit'];
            this.sortField = {field: params['sort'], order: params['order']}
            this.refreshProductsList();
          }
        }
      });
  }

  private refreshProductsList(): void {
    this.dataService.getProducts(this.firstItem, this.itemsPerPage, this.sortField)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IGetProductsList) => {
          this.products = [...response.products];
          this.totalItems = response.total;
          this.changeDetectorRef.detectChanges();
        },
        error: () => undefined // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! handler?
      });
  }

  private isLegalMode(mode: string): boolean {
    if (!mode) return true;
    const legalValues: Array<string> = Object.values(this.productsListModeEnum);
    return !!legalValues.find(v => v === mode);
  }

  editProductClick(product: IProductsListItem): void {
    console.log(product);
  }

  deleteProductClick(product: IProductsListItem): void {
    console.log(product);
  }

  setImageClick(product: IProductsListItem): void {
    console.log(product);
    alert('not implemented yet')
  }
}
