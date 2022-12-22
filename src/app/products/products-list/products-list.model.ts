export enum EProductsListMode {
  All = 'all',
  Selected = 'selected'
}

export interface IProductsListItem {
  id: number;
  title: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  image: string;
  isSelected?: boolean;
}

export interface IGetProductsList {
  limit: number;
  ordering: string;
  products: Array<IProductsListItem>
  skip: number;
  total: number;
}

export interface IProductFormOptions {
  product?: IProductsListItem;
  header: string;
}
