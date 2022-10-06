const refs = {
  bodyEl: document.querySelector('body'),
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
};

refs.startBtn.addEventListener('click', onStartClick);
refs.stopBtn.addEventListener('click', onStopClick);

let startEnabled = false;
let intervalId = null;

function onStartClick() {
  if (startEnabled) {
    return;
  } else {
    intervalId = setInterval(() => {
      refs.bodyEl.style.backgroundColor = `${getRandomHexColor()}`;
    }, 1000);
    startEnabled = true;
  }
}

function onStopClick() {
  clearInterval(intervalId);
  startEnabled = false;
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
