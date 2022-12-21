import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {EProductsListMode} from './products-list.model';

@Component({
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit, OnDestroy {
  productsListMode: EProductsListMode | null = null;

  private readonly destroy$: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listenRouter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private listenRouter(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params: Params) => {
          if (this.isLegalMode(params['mode'])) {
            this.productsListMode = params['mode'];
            this.changeDetectorRef.detectChanges();
          } else {
            this.router.navigate(['/page404']);
          }
        }
      });
  }

  private isLegalMode(mode: string): boolean {
    if (!mode) return true;
    const productsListModeEnum: typeof EProductsListMode = EProductsListMode;
    const legalValues: Array<string> = Object.values(productsListModeEnum);
    return !!legalValues.find(v => v === mode);
  }

}
