import Phaser from 'phaser';
import BootScene from './scripts/scenes/BootScene';
import PreloadScene from './scripts/scenes/PreloadScene';
import StartScene from './scripts/scenes/StartScene';
import GameScene from './scripts/scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  dom: {
    createContainer: true,
  },
  scene: [BootScene, PreloadScene, StartScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: { x: 0, y: 0 },
    },
  },
};

new Phaser.Game(config);
