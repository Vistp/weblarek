import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { ServerConnector } from './components/ServerConnector';
import { CardBasket } from './components/view/CardBasket';
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

/** Нажатие кнопки покупки товара */
events.on('card:add-to-cart', (product: IProduct) => {
  if (!cart.checkInCart(product.id)) {
    cart.add(product);
  }
  modal.close();
});


/** Изменение содержимого корзины */
events.on('basket:changed', () => {
  header.counter = cart.getItemsCount();

  const currentModalContent = modalContainer.querySelector('.basket');

  if (currentModalContent) {
    renderBasket();
  }
});

/** Нажатие кнопки открытия корзины */
events.on('basket:open', () => {
  renderBasket();
  modal.open();
});


serverConnector.getProducts()
  .then((data) => {
    catalog.setProducts(data.items);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });


/**
 * Отрисовка содержимого корзины
 */
const renderBasket = () => {
  const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
  const basketFragment = basketTemplate.content.cloneNode(true) as DocumentFragment;
  const basketContainer = basketFragment.firstElementChild as HTMLElement;

  const basketListElement = basketContainer.querySelector('.basket__list') as HTMLElement;
  const basketPriceElement = basketContainer.querySelector('.basket__price') as HTMLElement;
  const basketButton = basketContainer.querySelector('.basket__button') as HTMLButtonElement;

  const items = cart.getItems();

  const itemsList = items.map((product, index) => {
    const itemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
    const itemFragment = itemTemplate.content.cloneNode(true) as DocumentFragment;
    const itemContainer = itemFragment.firstElementChild as HTMLElement;

    const cardBasket = new CardBasket(itemContainer, {
      onDelete: () => {
        cart.remove(product.id);
      }
    });

    cardBasket.title = product.title;
    cardBasket.price = product.price;
    cardBasket.index = index + 1;

    return cardBasket.render();
  });

  basketListElement.replaceChildren(...itemsList);
  basketPriceElement.textContent = `${cart.getTotalPrice()} синапсов`;

  if (basketButton) {
    basketButton.disabled = items.length === 0;
    basketButton.addEventListener('click', () => {
      events.emit('order:open');
    });
  }

  modal.content = basketContainer;
};
