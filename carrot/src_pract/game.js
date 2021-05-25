"use strict";
import * as sound from "./sound.js";
import { Field, ItemType } from "./field.js";

export const Reason = Object.freeze({
  win: "win",
  lost: "lost",
  cancel: "cancel",
});

export class GameBuilder {
  withGameDuration(duration) {
    this.duration = duration;
    return this;
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration, //
      this.carrotCount,
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector(".game__button");
    this.gameScore = document.querySelector(".game__score");
    this.gameTimer = document.querySelector(".game__timer");

    this.gameBtn.addEventListener("click", () => {
      if (this.isStarted) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.gameField = new Field(this.carrotCount, this.bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.isStarted = false;
    this.score = 0;
    this.timer = undefined;
  }

  onItemClick = (e) => {
    if (!this.started) {
      return;
    }

    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  };

  start() {
    this.isStarted = true;
    this.initGame();
    this.startGameTimer();
    this.showStopBtn();
    this.showTimerAndScore();
    sound.playBg();
  }

  stop(reason) {
    this.isStarted = false;
    this.stopGameTimer();
    this.hideGameBtn();
    sound.stopBg();
    sound.playAlert();
    this.onGameStop && this.onGameStop(reason);
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerText = `${this.carrotCount}`;
    this.gameField.init();
  }

  showStopBtn() {
    const icon = document.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    this.gameBtn.style.visibility = "visible";
  }

  hideGameBtn() {
    this.gameBtn.style.visibility = "hidden";
  }

  // score and timer
  showTimerAndScore() {
    this.gameTimer.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.lost);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
  }

  updateScoreBoard(score) {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}
