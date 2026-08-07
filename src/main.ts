import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { ServerConnector } from './components/ServerConnector';
import { CardBasket } from './components/view/CardBasket';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { ContactsForm } from './components/view/ContactsForm';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { OrderForm } from './components/view/OrderForm';
import './scss/styles.scss';
import { IProduct, TPayment } from './types';
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

/** Нажатие кнопки оформления заказа */
events.on('order:open', () => {
  buyer.clearData();

  const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
  const orderFragment = orderTemplate.content.cloneNode(true) as DocumentFragment;
  const orderContainer = orderFragment.firstElementChild as HTMLFormElement;

  const orderForm = new OrderForm(orderContainer, events);

  modal.content = orderForm.render();
});

/** Изменение способа оплаты */
events.on('order:payment-changed', (data: { method: TPayment }) => {
  buyer.setPayment(data.method);

  const formElement = modalContainer.querySelector('form[name="order"]') as HTMLFormElement;
  if (formElement) {
    const orderForm = new OrderForm(formElement, events);
    const errors = buyer.validate();
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = errors.payment || errors.address || '';
    orderForm.payment = data.method;
  }
});

/** Изменение адреса доставки */
events.on('order:input-changed', (data: { field: string; value: string }) => {
  if (data.field === 'address') {
    buyer.setAddress(data.value);

    const formElement = modalContainer.querySelector('form[name="order"]') as HTMLFormElement;
    if (formElement) {
      const orderForm = new OrderForm(formElement, events);
      const errors = buyer.validate();
      orderForm.valid = !errors.payment && !errors.address;
      orderForm.errors = errors.payment || errors.address || '';
    }
  }
});

/** Нажатие кнопки перехода ко второй форме оформления заказа */
events.on('order:submit', () => {
  const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
  const contactsFragment = contactsTemplate.content.cloneNode(true) as DocumentFragment;
  const contactsContainer = contactsFragment.firstElementChild as HTMLFormElement;

  const contactsForm = new ContactsForm(contactsContainer, events);

  modal.content = contactsForm.render();
});

/** Изменение данных формы email и телефон */
events.on('contacts:input-changed', (data: { field: string; value: string }) => {
  if (data.field === 'email') {
    buyer.setEmail(data.value);
  } else if (data.field === 'phone') {
    buyer.setPhone(data.value);
  }

  const formElement = modalContainer.querySelector('form[name="contacts"]') as HTMLFormElement;
  if (formElement) {
    const contactsForm = new ContactsForm(formElement, events);
    const errors = buyer.validate();

    contactsForm.valid = !errors.email && !errors.phone;
  }
});

/** Нажатие кнопки оплаты/завершения оформления заказа */
events.on('contacts:submit', () => {
  const orderData = {
    ...buyer.getData(),
    items: cart.getItems().map(item => item.id),
    total: cart.getTotalPrice()
  };

  serverConnector.postOrder(orderData)
    .then((result) => {
      const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
      const successFragment = successTemplate.content.cloneNode(true) as DocumentFragment;
      const successContainer = successFragment.firstElementChild as HTMLElement;

      const descriptionElement = successContainer.querySelector('.order-success__description') as HTMLElement;
      const closeButton = successContainer.querySelector('.order-success__close') as HTMLButtonElement;

      if (descriptionElement) {
        descriptionElement.textContent = `Списано ${result.total} синапсов`;
      }

      if (closeButton) {
        closeButton.addEventListener('click', () => {
          modal.close();
        });
      }

      modal.content = successContainer;

      cart.clear();
      buyer.clearData();
    })
    .catch((error) => {
      console.error('Ошибка при отправке заказа:', error);
    });
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
