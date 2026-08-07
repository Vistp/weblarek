import { IHeaderState } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/** Класс Корзина со счетчиком */
export class Header extends Component<IHeaderState> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.basketButton = container.querySelector(
      ".header__basket",
    ) as HTMLButtonElement;
    this.counterElement = container.querySelector(
       ".header__basket-counter",
    ) as HTMLElement;

    if (this.basketButton) {
      this.basketButton.addEventListener("click", () => {
        events.emit("basket:open");
      });
    }
  }

  set counter(value: number) {
    if (this.counterElement) {
      this.counterElement.textContent = String(value);
    }
  }
}
