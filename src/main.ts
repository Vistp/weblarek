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
import { Basket } from './components/view/Basket';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { IProduct, TPayment } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';

const events = new EventEmitter();
const api = new Api(API_URL);
const serverConnector = new ServerConnector(api);

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const headerContainer = document.querySelector('.header') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;

const basketContainer = (basketTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement;
const successContainer = (successTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement;
const orderContainer = (orderTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLFormElement;
const contactsContainer = (contactsTemplate.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLFormElement;


const header = new Header(headerContainer, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(basketContainer, events);
const success = new Success(successContainer, events);
const orderForm = new OrderForm(orderContainer, events);
const contactsForm = new ContactsForm(contactsContainer, events);

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
        events.emit('card:select', product);
      }
    });

    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = {
      src: product.image,
      alt: product.title
    }

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
      if (cart.checkInCart(product.id)) {
        cart.remove(product.id);
      } else {
        if (product.price !== null) {
          cart.add(product);
        }
      }
      modal.close();
    }
  });

  cardPreview.title = product.title;
  cardPreview.price = product.price;
  cardPreview.category = product.category;
  cardPreview.image = product.image;

  cardPreview.text = product.description;

  if (product.price !== null) {
    cardPreview.buttonText = cart.checkInCart(product.id) ? 'Удалить из корзины' : 'В корзину';
  }

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
    updateBasketData();
  }
});

/** Нажатие кнопки открытия корзины */
events.on('basket:open', () => {
  updateBasketData();
  modal.content = basket.render();
  modal.open();
});

/** Нажатие кнопки оформления заказа */
events.on('order:open', () => {
  buyer.clearData();

  const errors = buyer.validate();

  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = errors.payment || errors.address || '';
  orderForm.payment = '';

  modal.content = orderForm.render();
});

/** Изменение способа оплаты */
events.on('order:payment-changed', (data: { method: TPayment }) => {
  buyer.setPayment(data.method);

  const errors = buyer.validate();

  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = errors.payment || errors.address || '';
  orderForm.payment = data.method;
});

/** Изменение адреса доставки */
events.on('order:input-changed', (data: { field: string; value: string }) => {
  if (data.field === 'address') {
    buyer.setAddress(data.value);

    const errors = buyer.validate();

    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = errors.payment || errors.address || '';
  }
});

/** Нажатие кнопки перехода ко второй форме оформления заказа */
events.on('order:submit', () => {
  const errors = buyer.validate();

  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = errors.email || errors.phone || '';

  modal.content = contactsForm.render();
});

/** Изменение данных формы email и телефон */
events.on('contacts:input-changed', (data: { field: string; value: string }) => {
  if (data.field === 'email') {
    buyer.setEmail(data.value);
  } else if (data.field === 'phone') {
    buyer.setPhone(data.value);
  }

  const errors = buyer.validate();

  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = errors.email || errors.phone || '';
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
      modal.content = success.render({ total: result.total });

      cart.clear();
      buyer.clearData();
    })
    .catch((error) => {
      console.error('Ошибка при отправке заказа:', error);
    });
});

/** Закрытие модального окна */
events.on('modal:close', () => {
  orderForm.clear();
  contactsForm.clear();
});

/** Закрытие окна успешного заказа */
events.on('success:close', () => {
  modal.close();
});

serverConnector.getProducts()
  .then((data) => {
    const parsedProducts = data.items.map(item => ({
      ...item,
      image: `${CDN_URL}${item.image}`
    }));

    catalog.setProducts(parsedProducts);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });

/**
 * Оновление данных внутри корзины
 */
function updateBasketData() {
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

  basket.items = itemsList;
  basket.total = cart.getTotalPrice();
}