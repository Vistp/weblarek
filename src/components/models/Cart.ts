import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

/** Класс Корзина товаров */
export class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  add(product: IProduct): void {
    this.items.push(product);
    this.events.emit("basket:changed");
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit("basket:changed");
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  checkInCart(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
