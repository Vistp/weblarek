import { IFormState } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/** Базовый класс Форма */
export class Form<T extends IFormState = IFormState> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    this.errorElement = container.querySelector(".form__errors") as HTMLElement;

    this.container.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;

      this.events.emit(`${container.name}:input-changed`, {
        field: target.name,
        value: target.value,
      });
    });

    this.container.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    if (this.submitButton) {
      if (value) {
        this.submitButton.removeAttribute("disabled");
      } else {
        this.submitButton.setAttribute("disabled", "true");
      }
    }
  }

  set errors(value: string) {
    if (this.errorElement) {
      this.errorElement.textContent = value;
    }
  }
}
