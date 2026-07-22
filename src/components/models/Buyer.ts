import { IBuyer, TPayment } from "../../types";

/** Класс Покупатель */
export class Buyer {
  payment: TPayment = '';
  address: string = '';
  phone: string = '';
  email: string = '';

  constructor() {}

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setEmail(email: string): void {
    this.email = email;
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
  }

  validate(): object {
    const errors: { [key: string]: string } = {};

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
