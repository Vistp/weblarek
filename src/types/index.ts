export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

/** Карточка товара */
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/** Покупатель */
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

/** Способ оплаты */
export type TPayment = 'card' | 'cash' | '';

/** Ошибки валидации */
export type TErrors = Partial<Record<keyof IBuyer, string>>;


/** Ответ сервера при запросе списка товаров */
export interface IProductResponse {
  total: number;
  items: IProduct[];
}

/** Данные, передаваемые на сервер */
export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

/** Объект ответа сервера при успешном проведении транзакции и создании заказа */
export interface IOrderResult {
/** Идентификатор созданного в системе заказа */
  id: string;
/** Сумма покупки, подтвержденная сервером после проведения оплаты */
  total: number;
}

/** Счетчик товаров в шапке сайта */
export interface IHeaderState {
  counter: number;
}

/** Каталог товаров */
export interface IGalleryState {
  catalog: HTMLElement[];
}

/** Интерфейсы карточек товаров */

/** Карточка товара (базовый класс) */
export interface ICardState {
  title: string;
  price: number | null;
}

/** Карточка каталога */
export interface ICardCatalogState extends ICardState {
  category: string;
  image: string;
}

/** Карточка подробного просмотра */
export interface ICardPreviewState extends ICardState {
  category: string;
  image: string;
  text: string;
  buttonText: string;
}

/** Интерфейсы форм */

/** Форма (базовый класс) */
export interface IFormState {
  valid: boolean;
  errors: string;
}

/** Форма доставки */
export interface IOrderFormState extends IFormState {
  payment: string;
  address: string;
}

/** Форма контактов */
export interface IContactsFormState extends IFormState {
  email: string;
  phone: string;
}

/** Модальное окно */
export interface IModalState {
  content: HTMLElement;
}

/** Корзина товаров */
export interface IBasketState {
  items: HTMLElement[];
  total: number;
}

/** Успешный заказ */
export interface ISuccessState {
  total: number;
}


/** Действия для карточек товаров*/

/** Действия для карточки в каталоге товаров */
export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

/** Действия для карточки подробного просмотра */
export interface ICardPreviewActions extends ICardActions {
  onAction: (event: MouseEvent) => void;
}

/** Действия для карточки в корзине */
export interface ICardBasketActions {
  onDelete: (event: MouseEvent) => void;
}
