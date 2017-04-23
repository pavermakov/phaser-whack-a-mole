import Phaser from 'phaser';
import utils from '../utils';

export default class extends Phaser.State {
  init() {
    // инициализация локальных переменных
    this._imagePath = this.game._GLOBAL.imagePath;
  }

  preload() {
    // индикатор загрузки
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.preloadBar);

    // подгрузи ассеты для всей игры здесь
    this.load.image('grass', `${this._imagePath}grass.png`);
    this.load.image('hole', `${this._imagePath}hole.png`);
    this.load.image('mole', `${this._imagePath}mole.png`);

    // по завершении загрузки ассетов, перейди в 'Menu State'
    this.load.onLoadComplete.addOnce(utils.proceedToState.bind(this, 'Game'));
  }
}
