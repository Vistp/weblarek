import { ICardState} from "../../types";
import { Component } from "../base/Component";

/** Базовый класс Карточка товара */
export class Card extends Component<ICardState> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector(".card__title") as HTMLElement;
    this.priceElement = container.querySelector(".card__price") as HTMLElement;
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this.priceElement) {
      if (value === null) {
        this.priceElement.textContent = '';
      } else {
        this.priceElement.textContent = `${value} синапсов`;
      }
    }
  }
}
