import { IModalState } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/** Класс Модальное окно */
export class Modal extends Component<IModalState> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.closeButton = container.querySelector(
      ".modal__close",
    ) as HTMLButtonElement;
    this.contentElement = container.querySelector(
      ".modal__content",
    ) as HTMLElement;

    this.closeButton?.addEventListener("click", () => this.close());

    this.container?.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    if (this.contentElement) {
      this.contentElement.replaceChildren(value);
    }
  }

  open(): void {
    if (this.container) {
      this.container.classList.add("modal_active");
      this.events.emit("modal:open");
    }
  }

  close(): void {
    if (this.container) {
      this.container.classList.remove("modal_active");
      if (this.contentElement) {
        this.contentElement.replaceChildren();
      }
      this.events.emit("modal:close");
    }
  }
}
