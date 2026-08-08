import { ICardPreviewActions } from "../../types";
import { categoryMap } from "../../utils/constants";
import { Card } from "./Card";

/** Класс Карточка подробного просмотра */
export class CardPreview extends Card {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected textElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
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

    if (actions?.onAction && this.actionButton) {
      this.actionButton.addEventListener("click", (event) => {
        event.stopPropagation();
        actions.onAction(event);
      });
    }
  }

  set price(value: number | null) {
    if (this.priceElement) {
      this.priceElement.textContent = value === null ? "" : `${value} синапсов`;
    }

    if (value === null && this.actionButton) {
      this.actionButton.disabled = true;
      this.actionButton.textContent = "Недоступно";
    }
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      this.categoryElement.className = "card__category";
      const categoryClass = categoryMap[value as keyof typeof categoryMap] || "card__category_other";
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set image(value: { src: string; alt: string }) {
    if (this.imageElement && value) {
      this.setImage(
        this.imageElement,
        value.src,
        value.alt
      );
    }
  }

  set text(value: string) {
    if (this.textElement) {
      this.textElement.textContent = value;
    }
  }

  set buttonText(value: string) {
    if (this.actionButton && this.actionButton.textContent !== "Недоступно") {
      this.actionButton.textContent = value;
    }
  }
}