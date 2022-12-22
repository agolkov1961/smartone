import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  title = 'Learning of PrimeNG ))';

  constructor() { }

  handleAddProductButtonClick(): void {
    console.log('click');
  }

}
