import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { ServerConnector } from './components/ServerConnector';
import { CardCatalog } from './components/view/CardCatalog';
import { Header } from './components/view/Header';
import './scss/styles.scss';
import { API_URL } from './utils/constants';

const events = new EventEmitter();
const api = new Api(API_URL);
const serverConnector = new ServerConnector(api);

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const headerContainer = document.querySelector('.header') as HTMLElement;

const header = new Header(headerContainer, events);

events.on('items:changed', () => {
  const products = catalog.getProducts();

  const cardsList = products.map((product) => {
    const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const cardFragment = cardTemplate.content.cloneNode(true) as DocumentFragment;
    const cardContainer = cardFragment.querySelector('.gallery__item') as HTMLElement;

    const card = new CardCatalog(cardContainer, {
      onClick: () => {
        catalog.setPreviewProduct(product);
      }
    });

    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;

    return card.render();
  });

  galleryContainer.replaceChildren(...cardsList);
});

serverConnector.getProducts()
  .then((data) => {
    catalog.setProducts(data.items);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });