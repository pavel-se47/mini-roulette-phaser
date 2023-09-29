export default class Colors {
  constructor() {}

  currentColor = value => {
    if (value === 0) {
      return 'green';
    } else if (value === 3 || value === 4 || value === 8 || value === 7 || value === 10 || value === 'AR') {
      return 'red';
    } else if (value === 1 || value === 2 || value === 5 || value === 6 || value === 9 || value === 'AB') {
      return 'black';
    }
  };

  currentColorHex = value => {
    if (value === 0) {
      return '0x00cc00';
    } else if (value === 3 || value === 4 || value === 8 || value === 7 || value === 10 || value === 'AR') {
      return '0xff0000';
    } else if (value === 1 || value === 2 || value === 5 || value === 6 || value === 9 || value === 'AB') {
      return '0x000000';
    }
  };
}
