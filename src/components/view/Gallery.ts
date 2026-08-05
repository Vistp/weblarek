import { IGalleryState } from "../../types";
import { Component } from "../base/Component";

/** Класс Каталог товаров */
export class Gallery extends Component<IGalleryState> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.catalogElement = container;
  }

  set catalog(items: HTMLElement[]) {
    if (this.catalogElement) {
      this.catalogElement.replaceChildren(...items);
    }
  }
}
