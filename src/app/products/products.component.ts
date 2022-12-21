import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  title = 'Test SmartOne';

  constructor() { }

  ngOnInit(): void {
  }

  handleAddProductButtonClick(): void {
    console.log('click');
  }

}
