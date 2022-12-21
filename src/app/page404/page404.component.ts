import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/api';

@Component({
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page404Component implements OnInit {
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
    console.log(event.originalEvent.type);
    const isItemClick: boolean = event.originalEvent?.type === 'click';
    if (isItemClick) {
      this.router.navigate([event.item.id], {queryParams: { page: 'start' },queryParamsHandling: 'merge'});
    }
  }

}
