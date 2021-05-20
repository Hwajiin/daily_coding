"use strict";

const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const CARROT_SIZE = 80;
const GAME_DURATION_SEC = 5;

const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();

const popUp = document.querySelector(".pop-up");
const popUpRefresh = document.querySelector(".pop-up__refresh");
const popUpText = document.querySelector(".pop-up__message");

const carrotSound = new Audio("sound/carrot_pull.mp3");
const bugSound = new Audio("sound/bug_pull.mp3");
const bgSound = new Audio("sound/bg.mp3");
const winSound = new Audio("sound/game_win.mp3");
const alertSound = new Audio("sound/alert.wav");

let isStarted = false;
let score = 0;
let timer = undefined;

// Event Handler
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

// Important Function
function startGame() {
  isStarted = true;
  initGame();
  showTimerAndScore();
  showStopButton();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  hideGameButton();
  stopGameTimer();
  showPopUpWithText("REPLAY?");
  stopSound(bgSound);
  playSound(alertSound);
}

function finishGame(win) {
  isStarted = false;
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopSound(bgSound);
  stopGameTimer();
  hideGameButton();
  showPopUpWithText(win ? "YOU WIN" : "YOU LOST");
}

function initGame() {
  field.innerHTML = "";
  gameScore.innerText = `${CARROT_COUNT}`;
  addItems("carrot", CARROT_COUNT, "img/carrot.png");
  addItems("bug", BUG_COUNT, "img/bug.png");
}

// carrot and bug
function addItems(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);

    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);

    item.style.position = `absolute`;
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
    score++;
    playSound(carrotSound);
    updateScoreBoard(score);
    if (CARROT_COUNT === score) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
}

// Timer and Score
function showTimerAndScore() {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}

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
  const minutes = Math.round(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateScoreBoard(score) {
  gameScore.innerText = CARROT_COUNT - score;
}

// popup
function showPopUpWithText(text) {
  popUp.classList.remove("pop-up--hide");
  popUpText.innerText = text;
}

function hidePopUp() {
  popUp.classList.add("pop-up--hide");
}

// show and hide
function showStopButton() {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameBtn.style.visibility = "visible";
}

function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}

// sound
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
