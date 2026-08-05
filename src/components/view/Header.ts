import { IHeaderState } from "../../types";
import { Component } from "../base/Component";

/** Класс Корзина со счетчиком */
export class Header extends Component<IHeaderState> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.basketButton = container.querySelector(
      ".header__basket",
    ) as HTMLButtonElement;
    this.counterElement = container.querySelector(
       ".header__basket-counter",
    ) as HTMLElement;
  }

  set counter(value: number) {
    if (this.counterElement) {
      this.counterElement.textContent = String(value);
    }
  }
}
