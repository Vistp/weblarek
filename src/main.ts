import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import './scss/styles.scss';
import { apiProducts } from './utils/data';

/** Проверка работы классов */

const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();


/** Каталог товаров */
console.log("***Каталог товаров***");

catalog.setProducts(apiProducts.items); // Cохранение массива товаров, полученного в параметрах метода
console.log('Получение массива товаров из модели:', catalog.getProducts());

const productItemId = apiProducts.items[0].id;
console.log('Получение одного товара по его id', catalog.getProductById(productItemId));

const productItemForPreview = apiProducts.items[0]; // TODO: пеерменную вынести наверх
catalog.setPreviewProduct(productItemForPreview); // Cохранение товара для подробного отображения

console.log('получение товара для подробного отображения:', catalog.getPreviewProduct());


/** Корзина товаров */
console.log("***Корзина товаров***");

console.log('Получение массива товаров, которые находятся в корзине:', cart.getItems());

cart.add(productItemForPreview); // Добавление товара, который был получен в параметре, в массив корзины
console.log(`Проверка наличия товара в корзине с id ${productItemForPreview.id} после добавления:`, cart.checkInCart(productItemForPreview.id));

cart.remove(productItemForPreview.id); // Удаление товара, полученного в параметре из массива корзины
console.log(`Проверка наличия товара в корзине с id ${productItemForPreview.id} после удаления:`, cart.checkInCart(productItemForPreview.id));

console.log('Добавление в корзину товара и проверка до очистки корзины');
cart.add(productItemForPreview);
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