import flatpickr from 'flatpickr';
require('flatpickr/dist/themes/dark.css');
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
  dateEl: document.querySelector('#datetime-picker'),
};

refs.startBtn.setAttribute('disabled', 'true');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  /*   plugins: [new confirmDatePlugin({})], */
  onClose(selectedDates) {
    const dateNow = new Date();
    console.log(selectedDates[0]);
    if (selectedDates[0] <= dateNow) {
      refs.startBtn.disabled = true;
      Notify.failure('Please choose a date in the future');
    } else {
      if (!timer.isActive) {
        refs.startBtn.disabled = false;
      }
    }
  },
  onOpen() {
    timer.stop();
  },
};

flatpickr('#datetime-picker', options);

const timer = {
  isActive: false,
  intervalId: null,

  start() {
    const endDate = new Date(refs.dateEl.value);
    refs.startBtn.disabled = true;
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = endDate - currentTime;
      const time = this.convertMs(deltaTime);
      updateTime(time);
      if (deltaTime <= 1000) {
        this.stop();
      }
    }, 1000);
  },
  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
    refs.startBtn.disabled = true;
  },
  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  },
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );
    return { days, hours, minutes, seconds };
  },
};

function updateTime({ days, hours, minutes, seconds }) {
  refs.daysEl.textContent = `${days}`;
  refs.hoursEl.textContent = `${hours}`;
  refs.minutesEl.textContent = `${minutes}`;
  refs.secondsEl.textContent = `${seconds}`;
}

refs.startBtn.addEventListener('click', timer.start.bind(timer));
