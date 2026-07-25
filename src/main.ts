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

catalog.setProducts(apiProducts.items); // Cохранение массива товаров, полученного в параметрах метода
console.log('Получение массива товаров из модели:', catalog.getProducts());

const productItemId = apiProducts.items[0].id;
console.log('Получение одного товара по его id', catalog.getProductById(productItemId));

const productItemForPreview = apiProducts.items[0];
catalog.setPreviewProduct(productItemForPreview); // Cохранение товара для подробного отображения

console.log('получение товара для подробного отображения:', catalog.getPreviewProduct());