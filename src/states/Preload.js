import Phaser from 'phaser';
import WebFont from 'webfontloader';
import utils from '../utils';

export default class extends Phaser.State {
  init() {
    // инициализация локальных переменных
    this._imagePath = this.game._GLOBAL.imagePath;
    this._fontsReady = false;
    this._assetsReady = false;
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

    // загрузка шрифтов
    // WebFont.load({
    //   google: {
    //     families: ['Holtwood One SC'],
    //   },
    //   custom: {
    //     families: ['ProximaNova'],
    //   },
    //   active: this._finishFonts.bind(this),
    // });

    this.load.onLoadComplete.addOnce(utils.proceedToState.bind(this, 'Game'));
    
  }

  // update() {
  //   if(!this._assetsReady && !this._fontsReady) {
  //     // по завершении загрузки ассетов и шрифтов, перейди в 'Menu State'
  //     // utils.proceedToState.bind(this, 'Game');
  //   }
  // }

  _finishAssets() {
    console.log('assets ready')
    this._assetsReady = true;
  }

  _finishFonts() {
    console.log('fonts ready')
    this._fontsReady = true;
  }
}
