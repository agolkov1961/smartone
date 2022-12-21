import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-products-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsSidebarComponent implements OnInit {
  items: Array<MenuItem> = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.items = [
      {id: 'all', label: 'All products', command: this.handleItemClick.bind(this)},
      {id: 'selected', label: 'Favorites', icon: 'pi pi-star-fill', command: this.handleItemClick.bind(this)}
    ];
  }

  private handleItemClick(event: any): void {
    const isItemClick: boolean = event.originalEvent?.type === 'click';
    if (isItemClick) {
      this.router.navigate(['/products/' + event.item.id], {queryParams: { page: '0' },queryParamsHandling: 'merge'});
    }
  }

}
