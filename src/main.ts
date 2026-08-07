import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { ServerConnector } from './components/ServerConnector';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL } from './utils/constants';

const events = new EventEmitter();
const api = new Api(API_URL);
const serverConnector = new ServerConnector(api);

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const headerContainer = document.querySelector('.header') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;

const header = new Header(headerContainer, events);
const modal = new Modal(modalContainer, events);

/** Изменение каталога товаров */
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

/** Изменение выбранного для просмотра товара */
events.on('preview:changed', (product: IProduct) => {
  const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
  const cardPreviewFragment = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
  const cardPreviewContainer = cardPreviewFragment.firstElementChild as HTMLElement;

  const cardPreview = new CardPreview(cardPreviewContainer, {
    onClick: () => {},
    onAction: () => {
      events.emit('card:add-to-cart', product);
    }
  });

  cardPreview.title = product.title;
  cardPreview.price = product.price;
  cardPreview.category = product.category;
  cardPreview.image = product.image;
  cardPreview.text = product.description;
  cardPreview.buttonText = 'В корзину';

  modal.content = cardPreview.render();
  modal.open();
});

serverConnector.getProducts()
  .then((data) => {
    catalog.setProducts(data.items);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });