"use strict";

const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const CARROT_SIZE = 80;
const GAME_DURATION_SEC = 5;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();

const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const popUp = document.querySelector(".pop-up");
const popUpRefresh = document.querySelector(".pop-up__refresh");
const popUpText = document.querySelector(".pop-up__message");

const carrotSound = new Audio("sound/carrot_pull.mp3");
const bugSound = new Audio("sound/bug_pull.mp3");
const alertSound = new Audio("sound/alert.wav");
const bgSound = new Audio("sound/bg.mp3");
const winSound = new Audio("sound/game_win.mp3");

let isStarted = false;
let timer = undefined;
let score = 0;

// EventListener
gameBtn.addEventListener("click", () => {
  if (isStarted) {
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

// Big Function
function stopGame() {
  isStarted = false;
  showPopUpWithText("REPLAY?");
  hideGameButton();
  stopGameTimer();
  stopSound(bgSound);
  playSound(alertSound);
}

function startGame() {
  initGame();
  showTimerAndScore();
  startGameTimer();
  showStopButton();
  playSound(bgSound);
}

function finishGame(win) {
  isStarted = false;
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopGameTimer();
  hideGameButton();
  stopSound(bgSound);
  showPopUpWithText(win ? "YOU WON" : "YOU LOST");
}

function initGame() {
  isStarted = true;
  field.innerHTML = "";
  gameScore.innerText = `${CARROT_COUNT}`;
  addItems("carrot", CARROT_COUNT, "img/carrot.png");
  addItems("bug", BUG_COUNT, "img/bug.png");
}

// Show
function showTimerAndScore() {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}

function showStopButton() {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameBtn.style.visibility = "visible";
}

// Hide
function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}

// Timer
function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    } else {
      updateTimerText(--remainingTimeSec);
    }
  }, 1000);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function stopGameTimer() {
  clearInterval(timer);
}

// score
function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
}

// popUp
function showPopUpWithText(text) {
  popUp.classList.remove("pop-up--hide");
  popUpText.innerText = text;
}

function hidePopUp() {
  popUp.classList.add("pop-up--hide");
}

// About carrot and bug
function addItems(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);

    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);

    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// field
function onFieldClick(e) {
  if (!isStarted) return;
  const target = e.target;
  if (target.matches(".carrot")) {
    target.remove();
    playSound(carrotSound);
    score++;
    updateScoreBoard();
    if (score == CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
}

// sound
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
