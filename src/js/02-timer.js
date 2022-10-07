import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

refs.startBtn.setAttribute('disabled', 'true');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= options.defaultDate) {
      refs.startBtn.disabled = true;
      Notify.failure('Please choose a date in the future');
    } else {
      if (!timer.isActive) {
        refs.startBtn.disabled = false;
        refs.startBtn.addEventListener('click', () => {
          timer.start(selectedDates[0]);
        });
      }
    }
  },
};

const timer = {
  isActive: false,
  intervalId: null,

  start(endTime) {
    refs.startBtn.disabled = true;
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = endTime - currentTime;
      const { days, hours, minutes, seconds } = this.convertMs(deltaTime);
      refs.daysEl.textContent = `${days}`;
      refs.hoursEl.textContent = `${hours}`;
      refs.minutesEl.textContent = `${minutes}`;
      refs.secondsEl.textContent = `${seconds}`;
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

flatpickr('#datetime-picker', options);
