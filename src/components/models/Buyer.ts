import { IBuyer, TErrors, TPayment } from "../../types";
import { IEvents } from "../base/Events";

/** Класс Покупатель */
export class Buyer {
  private payment: TPayment = '';
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  constructor(protected events: IEvents) {}

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit('buyer:changed');
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit('buyer:changed');
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit('buyer:changed');
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearData(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('buyer:changed');
  }

  validate(): TErrors {
    const errors: TErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.address.trim()) {
      errors.address = 'Укажите адрес';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Укажите номер телефона';
    }
    if (!this.email.trim()) {
      errors.email = 'Укажите емэйл';
    }

    return errors;
  }
}
