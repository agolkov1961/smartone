import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {finalize, Observable, Subject} from 'rxjs';
import {EProductsListMode, IGetProductsList, IProductFormOptions, IProductsListItem} from './products-list.model';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {takeUntil, tap} from 'rxjs/operators';
import {ProductsListLocalStorageService} from './services/products-list.ls-service';
import {ProductsListDataService} from './services/products-list.data-service';
import {ProductsListHelperService} from './services/products-list.helper-service';

@Component({
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  providers: [MessageService, ProductsListDataService, ProductsListLocalStorageService, ProductsListHelperService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit, OnDestroy {
  productsListMode: EProductsListMode | null = null;
  productsListModeEnum: typeof EProductsListMode = EProductsListMode;
  products: Array<IProductsListItem> = [];
  itemsPerPage: number = 0;
  sortField: { field: string, order: 'asc' | 'desc' } = {field: '', order: 'asc'};
  totalItems: number = 0;
  firstItem: number = 0;
  private readonly destroy$: Subject<void> = new Subject();
  productFormOptions: IProductFormOptions = {header: ''};
  visibleProductForm: boolean = false;
  @ViewChild('inputImageFile', {static: false}) inputImageFile: ElementRef | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: ProductsListDataService,
    private confirmationService: ConfirmationService,
    private helperService: ProductsListHelperService,
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
      queryParams: {
        first: event.first,
        limit: event.rows,
        sort: event.sortField,
        'order': (event.sortOrder || 1) < 0 ? 'desc' : 'asc'
      },
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
            this.router.navigate([], {queryParams: {limit: 10}, queryParamsHandling: 'merge'});
          } else if (!params['sort']) {
            this.router.navigate([], {queryParams: {sort: 'title'}, queryParamsHandling: 'merge'});
          } else {
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
    this.dataService.getProducts(this.productsListMode, this.firstItem, this.itemsPerPage, this.sortField)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IGetProductsList) => {
          this.products = [...response.products];
          this.totalItems = response.total;
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

  changeProductSelected(product: IProductsListItem, state: { checked: boolean }): void {
    product.isSelected = state.checked;
    this.dataService.updateSelectedListById(product.id, product.isSelected);
    const textMessage = 'The product has been successfully ' +
      (product.isSelected ? 'added to your favorites' : 'removed from the saved');
    this.messageService.add({key: 'bc', severity: 'info', summary: '', detail: textMessage, life: 2500});
  }

  unselectProductClick(product: IProductsListItem): void {
    this.helperService.confirmAction('deleteProductDialog', 'Are you sure you want to delete the selected product?', 'Unselect product')
      .pipe(takeUntil(this.destroy$))
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          this.dataService.updateSelectedListById(product.id, false);
          this.refreshProductsList();
        }
      });
  }

  addProductClick(): void {
    this.productFormOptions = {header: `New product`};
    this.visibleProductForm = true;
    this.changeDetectorRef.detectChanges();
  }

  editProductClick(product: IProductsListItem): void {
    this.productFormOptions = {product, header: `Edit product '${product.title}'`};
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
    this.helperService.confirmAction('deleteProductDialog', 'Are you sure you want to delete the selected product?', 'Delete Confirmation')
      .pipe(takeUntil(this.destroy$))
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          this.deleteProduct(product.id);
        }
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

  private currentProductId: number | undefined;

  setImageClick(product: IProductsListItem): void {
    this.currentProductId = product.id;
    this.inputImageFile?.nativeElement.click();
  }

  changeImageFile(event: any): void {
    const files: Array<File> = event.target?.files;
    if (files.length === 1 && this.currentProductId) {
      this.dataService.setProductImage(this.currentProductId, files[0].name)
        .pipe(
          finalize(() => this.currentProductId = undefined),
          takeUntil(this.destroy$)
        ).subscribe({
        next: () => this.refreshProductsList(),
        error: () => alert('Cann\'t set image for product')
      });
    }
  }

}
