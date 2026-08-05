import { IModalState } from "../../types";
import { Component } from "../base/Component";

/** Класс Модальное окно */
export class Modal extends Component<IModalState> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.closeButton = container.querySelector(
      ".modal__close",
    ) as HTMLButtonElement;
    this.contentElement = container.querySelector(
      ".modal__content",
    ) as HTMLElement;
  }

  set content(value: HTMLElement) {
    if (this.contentElement) {
      this.contentElement.replaceChildren(value);
    }
  }

  open(): void {
    if (this.container) {
      this.container.classList.add("modal_active");
    }
  }

  close(): void {
  if (this.container) {
      this.container.classList.remove("modal_active");
      if (this.contentElement) {
        this.contentElement.replaceChildren();
      }
    }
  }
}
