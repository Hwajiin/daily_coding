"use strict";

const CARROT_SIZE = 80;
const field = document.querySelector(".game__field");
const gameBtn = document.querySelector(".game__button");
const fieldRect = field.getBoundingClientRect();

function initGame() {
  // 1. item을 count만큼 만들어야함
  addItem("carrot", 5, "img/carrot.png");
  addItem("bug", 5, "img/bug.png");
}

function addItem(className, count, imgPath) {
  // 1. item 만들기
  // 2. random한 장소에 붙여넣기

  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0; i < count + 1; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);

    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);

    item.style.position = "absolute";
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

gameBtn.addEventListener("click", initGame);
