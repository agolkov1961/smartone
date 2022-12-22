import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  title = 'Learning of PrimeNG ))';

  constructor() { }

  handleAddProductButtonClick(): void {
    console.log('click');
  }

}
