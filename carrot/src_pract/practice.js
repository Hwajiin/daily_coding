"use strict";
import * as sound from "./sound.js";
import Popup from "./popup.js";
import GameBuilder, { Reason } from "./game.js";

const gameFinishBanner = new Popup();
const game = new GameBuilder()
  .withGameDuration(10)
  .withCarrotCount(5)
  .withBugCount(5).build;

const _game = new Game(10, 5, 5);
game.setStopListener((reason) => {
  switch (reason) {
    case Reason.cancel:
      message = "REPLAY?";
      sound.playAlert();
      break;
    case Reason.win:
      message = "YOU WIN";
      sound.playWin();
      break;
    case Reason.lost:
      message = "YOU LOST";
      sound.playBug();
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});
gameFinishBanner.setClickListener(() => {
  game.start();
});
