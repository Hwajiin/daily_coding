"use strict";

const BUTTER_TRACK_TIME = 28;

const playBtn = document.querySelector(".play");
const albumArts = document.querySelector(".album__arts");
const soundBar = document.querySelector("#sound__bar");

const currentTime = document.querySelector(".current__time");
const endTime = document.querySelector(".end__time");

const butter = new Audio("butter.mp3");

let started = false;
let timer = undefined;

// event Handler
playBtn.addEventListener("click", () => {
  if (started) {
    stopPlay();
  } else {
    startPlay();
  }
});

soundBar.addEventListener("change", () => {
  volumeControl(butter);
});

soundBar.addEventListener("mousemove", () => {
  volumeControl(butter);
});

// big function
function stopPlay() {
  started = false;
  stopSound(butter);
  showplayButton();
  stopRotate();
  stopUpdateCurrentTime();
}

function startPlay() {
  started = true;
  playSound(butter);
  showStopButton();
  startRotate();
  showEndTime(BUTTER_TRACK_TIME);
  updateCurrentTime(butter);
}

// rotate
function startRotate() {
  albumArts.style.animation = `rotate 0.7s linear infinite`;
}

function stopRotate() {
  albumArts.style.animation = `none`;
}

// button
function showStopButton() {
  const icon = playBtn.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
}

function showplayButton() {
  const icon = playBtn.querySelector(".fas");
  icon.classList.remove("fa-stop");
  icon.classList.add("fa-play");
}

// sound
function playSound(sound) {
  sound.play();
  sound.loop = "true";
}

function stopSound(sound) {
  sound.pause();
}

// volume control
function volumeControl(sound) {
  const value = soundBar.value / 100;
  sound.volume = value;
}

// progress Bar
function showEndTime(time) {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  endTime.innerHTML = `${mins < 10 ? `0${mins}` : `${mins}`}:${
    secs < 10 ? `0${secs}` : `${secs}`
  }`;
}

function updateCurrentTime(track, endTime) {
  let current = track.currentTime;
  updateCurrentTimeText(current);
  timer = setInterval(() => {
    if (current === endTime) {
      clearInterval(timer);
    } else {
      updateCurrentTimeText(current);
    }
  }, 1000);
}

function stopUpdateCurrentTime() {
  clearInterval(timer);
}

function updateCurrentTimeText(current) {
  const mins = Math.floor(current / 60);
  const secs = Math.floor(current % 60);
  currentTime.innerHTML = `${mins < 10 ? `0${mins}` : `${mins}`}:${
    secs < 10 ? `0${secs}` : `${secs}`
  }`;
}
