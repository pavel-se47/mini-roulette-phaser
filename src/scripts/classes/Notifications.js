import { alert, info, error, success } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

export default class Notifications {
  constructor() {}

  // successNotification(object) {
  //   success({
  //     title: `Congratulations! You bet ${object.value} win!`,
  //     text: `You win ${object.currentBet * object.coef} credits!`,
  //     delay: 1000,
  //     hide: true,
  //     width: '400px',
  //   });
  // }

  // errorNotification(object) {
  //   error({
  //     title: `Sorry, you bet ${object.value} lost :(`,
  //     text: `You lost ${object.currentBet} credits!`,
  //     delay: 1000,
  //     hide: true,
  //     width: '400px',
  //   });
  // }

  successNotification(bets, credits) {
    success({
      title: `Congratulations! You bet ${bets} win!`,
      text: `You win ${credits} credits!`,
      delay: 1000,
      hide: true,
      width: '400px',
    });
  }

  errorNotification(bets, credits) {
    error({
      title: `Sorry, you bet ${bets} lost :(`,
      text: `You lost ${credits} credits!`,
      delay: 1000,
      hide: true,
      width: '400px',
    });
  }

  alertNotification(title) {
    alert({
      title: title,
      delay: 2000,
      hide: true,
      width: '400px',
    });
  }

  infoNotification(title) {
    info({
      title: title,
      delay: 2000,
      hide: true,
      width: '400px',
    });
  }
}
