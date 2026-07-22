import { IProduct } from "../../types";

/** Класс Каталог товаров */
export class Catalog {
  products: IProduct[] = [];
  previewProduct: IProduct | null = null;

  constructor() {}

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  setPreviewProduct(product: IProduct): void {
    this.previewProduct = product;
  }

  getPreviewProduct(): IProduct | null {
    return this.previewProduct;
  }
}