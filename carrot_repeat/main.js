"use strict";
const GAME_DURATION_SEC = 10;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const CARROT_SIZE = 80;

const gameBtn = document.querySelector(".game__button");
const gameScore = document.querySelector(".game__score");
const gameTimer = document.querySelector(".game__timer");

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();

const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__message");
const popUpRefresh = document.querySelector(".pop-up__refresh");

let started = false;
let score = 0;
let timer = undefined;

// EventHandler
gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener("click", () => {
  startGame();
  hidePopUp();
});

field.addEventListener("click", onFieldClick);

// Important Function
function startGame() {
  started = true;
  initGame();
  showScoreAndTimer();
  startGameTimer();
  showStopButton();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  showPopUpWithText("REPLAY?");
  stopGameTimer();
  hideGameButton();
  stopSound(bgSound);
  playSound(alertSound);
}

function finishGame(win) {
  started = false;
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopSound(bgSound);
  hideGameButton();
  stopGameTimer();
  showPopUpWithText(win ? "YOU WIN" : "YOU LOST");
}

function initGame() {
  field.innerHTML = "";
  score = 0;
  gameScore.innerText = CARROT_COUNT;
  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug", BUG_COUNT, "img/bug.png");
}

// carrot and bug
function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("src", imgPath);
    item.setAttribute("class", className);

    item.style.position = `absolute`;
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Score and Timer
function showScoreAndTimer() {
  gameScore.style.visibility = "visible";
  gameTimer.style.visibility = "visible";
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    } else {
      updateTimerText(--remainingTimeSec);
    }
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function updateScoreBoard(score) {
  gameScore.innerText = CARROT_COUNT - score;
}
// show and hide btn
function showStopButton() {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameBtn.style.visibility = "visible";
}

function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}

// popup
function showPopUpWithText(text) {
  popUp.classList.remove("pop-up--hide");
  popUpText.innerText = text;
}

function hidePopUp() {
  popUp.classList.add("pop-up--hide");
}

// sound
const carrotSound = new Audio("sound/carrot_pull.mp3");
const bugSound = new Audio("sound/bug_pull.mp3");
const alertSound = new Audio("sound/alert.wav");
const bgSound = new Audio("sound/bg.mp3");
const winSound = new Audio("sound/game_win.mp3");

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

// Field
function onFieldClick(e) {
  if (!started) return;
  const target = e.target;
  if (target.matches(".carrot")) {
    target.remove();
    playSound(carrotSound);
    score++;
    updateScoreBoard(score);
    if (CARROT_COUNT === score) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
}
