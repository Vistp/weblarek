import { IOrder, IOrderResult, IProductResponse, IApi } from "../types";

/** Класс ServerConnector */
export class ServerConnector {
  protected _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this._api.get<IProductResponse>('/product/');
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>('/order/', order);
  }
}