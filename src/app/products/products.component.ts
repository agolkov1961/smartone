import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Params} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  title = 'SmartOne Test';
}
