import { IOrder, IOrderResult, IProductResponse } from "../../types";
import { Api } from "../base/Api";

/** Класс ServerConnector */
export class ServerConnector {
  protected _api: Api;

  constructor(api: Api) {
    this._api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this._api.get<IProductResponse>('/product/');
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>('/order/', order);
  }
}
