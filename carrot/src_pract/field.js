"use strict";

import * as sound from "./sound.js";

const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: "carrot",
  bug: "bug",
});

export default class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.field = document.querySelector(".game__field");
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener("click", this.onClick);
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick();
  }

  init() {
    this.field.innerHTML = "";
    this.addItems("carrot", this.carrotCount, "img/carrot.png");
    this.addItems("bug", this.bugCount, "img/bug.png");
  }

  addItems(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE;
    const y2 = this.fieldRect.height - CARROT_SIZE;

    for (let i = 0; i < count; i++) {
      const item = document.createElement("img");
      item.setAttribute("src", imgPath);
      item.setAttribute("class", className);

      item.style.position = `absolute`;
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);

      item.style.top = `${y}px`;
      item.style.left = `${x}px`;
      this.field.appendChild(item);
    }
  }

  onClick(e) {
    const target = e.target;
    if (target.matches(".carrot")) {
      target.remove();
      sound.playCarrot();
      this.onItemClick && this.onItemClick(ItemType.carrot);
    } else if (target.matches(".bug")) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
