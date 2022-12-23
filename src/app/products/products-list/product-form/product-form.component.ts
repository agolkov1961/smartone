import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit, Output
} from '@angular/core';
import {IProductFormOptions, IProductsListItem} from '../products-list.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent implements OnInit,AfterViewInit {
  @Input() options: IProductFormOptions = {header: ''};
  @Output() save: EventEmitter<IProductsListItem> = new EventEmitter();
  @Output() hide: EventEmitter<void> = new EventEmitter();
  productForm = {} as FormGroup;
  displayModal: boolean = false;

  private isButtonSaveClicked: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.options.product) this.fillForm(this.options.product);
  }

  ngAfterViewInit(): void {
    this.displayModal = true;
    this.changeDetectorRef.detectChanges();
  }

  saveClick(): void {
    if (this.productForm.valid) {
      this.displayModal = false;
      this.changeDetectorRef.detectChanges();
      this.save.emit(this.productForm.value);
    } else {
      this.isButtonSaveClicked = true;
      this.changeDetectorRef.detectChanges();
    }
  }

  onHideDialog(): void {
    this.hide.emit();
  }

  isInvalidField(field: string): boolean {
    const control = this.productForm.get(field);
    return !control?.valid && this.isButtonSaveClicked;
  }

  private initForm(): void {
    this.productForm = this.formBuilder.group({
      id: null,
      title: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      category: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: null,
    });
  }

  private fillForm(product: IProductsListItem): void {
    this.productForm.patchValue({
      id: product.id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      price: product.price,
      description: product.description
    });

  }
}
