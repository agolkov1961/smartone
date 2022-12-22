import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  title = 'Learning of PrimeNG ))';

  constructor() { }

  ngOnInit(): void {
  }

  handleAddProductButtonClick(): void {
    console.log('click');
  }

}
