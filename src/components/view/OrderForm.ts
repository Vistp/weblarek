import { IOrderFormState } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

/** Класс Форма доставки */
export class OrderForm extends Form<IOrderFormState> {
  protected cardPayButton: HTMLButtonElement;
  protected cashPayButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.cardPayButton = container.querySelector(
      'button[name="card"]',
    ) as HTMLButtonElement;
    this.cashPayButton = container.querySelector(
      'button[name="cash"]',
    ) as HTMLButtonElement;
    this.addressInput = container.querySelector(
      'input[name="address"]',
    ) as HTMLInputElement;

    this.cardPayButton?.addEventListener("click", () => {
      this.events.emit("order:payment-changed", { method: "card" });
    });

    this.cashPayButton?.addEventListener("click", () => {
      this.events.emit("order:payment-changed", { method: "cash" });
    });
  }

  set payment(value: string) {
    if (this.cardPayButton && this.cashPayButton) {
      this.cardPayButton.classList.toggle(
        "button_alt-active",
        value === "card",
      );
      this.cashPayButton.classList.toggle(
        "button_alt-active",
      value === "cash",
      );
    }
  }

  set address(value: string) {
    if (this.addressInput) {
      this.addressInput.value = value;
    }
  }

  render(data?: Partial<IOrderFormState>): HTMLElement {
    return super.render(data);
  }
}
