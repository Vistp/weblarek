import { Api } from './components/base/Api';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { ServerConnector } from './components/ServerConnector';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

/** Проверка работы классов */

const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

const testProductItem = apiProducts.items[0];


/** Каталог товаров */
console.log("***Каталог товаров***");

catalog.setProducts(apiProducts.items); // Cохранение массива товаров, полученного в параметрах метода
console.log('Получение массива товаров из модели:', catalog.getProducts());

const productItemId = apiProducts.items[0].id;
console.log('Получение одного товара по его id', catalog.getProductById(productItemId));

catalog.setPreviewProduct(testProductItem); // Cохранение товара для подробного отображения

console.log('получение товара для подробного отображения:', catalog.getPreviewProduct());


/** Корзина товаров */
console.log("***Корзина товаров***");

console.log('Получение массива товаров, которые находятся в корзине:', cart.getItems());

cart.add(testProductItem); // Добавление товара, который был получен в параметре, в массив корзины
console.log(`Проверка наличия товара в корзине с id ${testProductItem.id} после добавления:`, cart.checkInCart(testProductItem.id));

cart.remove(testProductItem.id); // Удаление товара, полученного в параметре из массива корзины
console.log(`Проверка наличия товара в корзине с id ${testProductItem.id} после удаления:`, cart.checkInCart(testProductItem.id));

console.log('Добавление в корзину товара и проверка до очистки корзины');
cart.add(testProductItem);
console.log('Получение массива товаров, которые находятся в корзине:', cart.getItems());
cart.clear(); // Очистка корзины

console.log('Проверка после очистки корзины');
console.log('Получение стоимости всех товаров в корзине', cart.getTotalPrice());
console.log('Получение количества товаров в корзине', cart.getItemsCount());


/** Покупатель */
console.log("***Покупатель***");

console.log('Валидация данных до заполнения данных покупателя', buyer.validate());

buyer.setPayment('card'); // Сохранение выбранного вида оплаты
buyer.setAddress('г. Пермь, ул. Ленина, д. 12, кв. 36'); // Сохранение введенного адреса доставки
buyer.setPhone('+7 999 999 99 99'); // Сохранение введенного номера телефона
buyer.setEmail('email@email.com'); // Сохранение введенной электронной почты

console.log('Получение всех данных покупателя:', buyer.getData());

console.log('Валидация данных после заполнения данных покупателя', buyer.validate());

buyer.clearData(); // Очистка данных покупателя
console.log('Получение всех данных покупателя после очистки данных:', buyer.getData());


/** Взаимодействие с API */
console.log("***Взаимодействие с API***");

const api = new Api(API_URL);
const serverConnector = new ServerConnector(api);

serverConnector.getProducts()
  .then((data) => {
    console.log('Ответ от сервера с массивом товаров:', data);

    catalog.setProducts(data.items); // Cохранение массива товаров, полученного в параметрах метода
    console.log('Получение массива товаров из модели после сохранения:', catalog.getProducts());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });