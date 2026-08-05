import { IFormState } from "../../types";
import { Component } from "../base/Component";

/** Базовый класс Форма */
export class Form<T extends IFormState = IFormState> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this.submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    this.errorElement = container.querySelector(".form__errors") as HTMLElement;
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
