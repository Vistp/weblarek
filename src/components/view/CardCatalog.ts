import { ICardActions} from "../../types";
import { categoryMap } from "../../utils/constants";
import { Card } from "./Card";

/** Класс Карточка каталога */
export class CardCatalog extends Card {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = container.querySelector(
      ".card__category",
    ) as HTMLElement;
    this.imageElement = container.querySelector(
      ".card__image",
    ) as HTMLImageElement;

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      this.categoryElement.className = "card__category";
      const categoryClass =
        categoryMap[value as keyof typeof categoryMap] ||
        "card__category_other";
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set image(value: { src: string; alt: string }) {
    if (this.imageElement && value) {
      this.setImage(
        this.imageElement,
        value.src,
        value.alt);
    }
  }
}
