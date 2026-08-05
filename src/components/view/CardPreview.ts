import { ICardPreviewState } from "../../types";
import { categoryMap } from "../../utils/constants";
import { Card } from "./Card";

/** Класс Карточка подробного просмотра */
export class CardPreview extends Card {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected textElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.categoryElement = container.querySelector(
      ".card__category",
    ) as HTMLElement;
    this.imageElement = container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    this.textElement = container.querySelector(".card__text") as HTMLElement;
    this.actionButton = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;
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

  set image(value: string) {
    if (this.imageElement) {
      this.setImage(
        this.imageElement,
        value,
        this.titleElement?.textContent || "",
      );
    }
  }

  set text(value: string) {
    if (this.textElement) {
      this.textElement.textContent = value;
    }
  }

  set buttonText(value: string) {
    if (this.actionButton) {
      this.actionButton.textContent = value;
    }
  }

  render(data?: Partial<ICardPreviewState>): HTMLElement {
    return super.render(data);
  }
}
