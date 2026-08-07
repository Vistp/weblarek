import { IContactsFormState } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

/** Класс Форма контактов */
export class ContactsForm extends Form<IContactsFormState> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput = container.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    this.phoneInput = container.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement;
  }

  set email(value: string) {
    if (this.emailInput) {
      this.emailInput.value = value;
    }
  }

  set phone(value: string) {
    if (this.phoneInput) {
      this.phoneInput.value = value;
    }
  }
}
