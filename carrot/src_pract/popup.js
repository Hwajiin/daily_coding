export default class Popup {
  constructor() {
    this.popUp = document.querySelector(".pop-up");
    this.popUpText = document.querySelector(".pop-up__message");
    this.popUpRefresh = document.querySelector(".pop-up__refresh");

    this.popUpRefresh.addEventListener("click", () => {
      this.onClick && onClick();
      this.hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  showWithText(text) {
    this.popUp.classList.remove("pop-up--hide");
    this.popUpText.textContent = text;
  }

  hide() {
    this.popUp.classList.add("pop-up--hide");
  }
}
