import { ICardBasketActions } from "../../types";
import { Card } from "./Card";

/** Класс Карточка в корзине */
export class CardBasket extends Card {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardBasketActions) {
    super(container);

    this.indexElement = container.querySelector(
      ".basket__item-index"
    ) as HTMLElement;
    this.deleteButton = container.querySelector(
      ".basket__item-delete"
    ) as HTMLButtonElement;

    if (actions?.onDelete && this.deleteButton) {
      this.deleteButton.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    if (this.indexElement) {
      this.indexElement.textContent = String(value);
    }
  }
}