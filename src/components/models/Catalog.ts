import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

/** Класс Каталог товаров */
export class Catalog {
  private products: IProduct[] = [];
  private previewProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('items:changed');
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  setPreviewProduct(product: IProduct): void {
    this.previewProduct = product;
    this.events.emit('preview:changed', product);
  }

  getPreviewProduct(): IProduct | null {
    return this.previewProduct;
  }
}
