import { IProduct } from "../../types";

/** Класс Корзина товаров */
export class Cart {
  private items: IProduct[] = [];

  constructor() {}

  getItems(): IProduct[] {
    return this.items;
  }

  add(product: IProduct): void {
    this.items.push(product);
  }

  remove(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  checkInCart(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}