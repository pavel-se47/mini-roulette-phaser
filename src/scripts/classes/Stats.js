export default class Stats {
  constructor() {}

  createStats = context => {
    const statsRectangle = context.add.rectangle(context.x / 2, 510, 650, 80, 0xffffff);

    const balanceText = context.add.text(context.x / 2 - 300, context.y / 2 - 50, 'Your balance: \n' + context.state.balance, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const currentBetText = context.add.text(context.x / 2 - 90, context.y / 2 - 50, 'Your current bet: \n' + context.state.currentBet, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const currentWinText = context.add.text(context.x / 2 + 140, context.y / 2 - 50, 'Your current win: \n' + context.state.currentWin, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });
  };
}
