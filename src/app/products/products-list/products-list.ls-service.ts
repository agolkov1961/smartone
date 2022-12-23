import { Injectable } from '@angular/core';

@Injectable()
export class ProductsListLocalStorageService {

  updateSelectedListById(id: number, isSelected: boolean): void {
    const selectedList: Array<number> = this.getSelectedList();
    const index: number = selectedList.findIndex(i => i === id);
    const lenBefore: number = selectedList.length;

    if (index >= 0 && !isSelected) selectedList.splice(index, 1);
    else if (index < 0 && isSelected) selectedList.push(id);

    if (lenBefore !== selectedList.length) this.setSelectedList(selectedList);
  }

  getSelectedList(): Array<number> {
    return JSON.parse(localStorage.getItem('products-selected') || '[]');
  }

  private setSelectedList(list: Array<number>): void {
    localStorage.setItem('products-selected', JSON.stringify(list));
  }
}
