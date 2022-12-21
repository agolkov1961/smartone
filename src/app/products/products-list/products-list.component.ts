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

  private currentPage: number = 0;
  private readonly destroy$: Subject<void> = new Subject();

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
          if (!isNaN(+params['page'])) {
            this.currentPage = +params['page'];
            this.refreshProductsList();
          }
        }
      });
  }

  private refreshProductsList(): void {
    this.dataService.getProducts(this.currentPage, this.itemsPerPage)
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

}
