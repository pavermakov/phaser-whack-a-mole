import Phaser from 'phaser';
import utils from '../utils';

export default class extends Phaser.State {
  init() {
    // инициализация глобальных переменных
    this.game._GLOBAL = {
      dpi: window.devicePixelRatio,
      imagePath: 'assets/images/',
      resolution: this._getAssetResolution(),
    };

    this.game.transparent = true;
    this.game.clearBeforeRender = false;
    this.game.renderer.renderSession.roundPixels = true;
    this.game.forceSingleUpdate = this.game._GLOBAL.isAndroid4 || this.game._GLOBAL.isIphone4 ? false : true;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // игра не остановится когда canvas потеряет фокус
    this.stage.disableVisibilityChange = false;
  }

  preload() {
    // подгрузи ассеты для загрузочного экрана тут
    this.load.image('bar', `${this.game._GLOBAL.imagePath}preloader-bar.png`);
    // по завершении загрузки ассетов, перейди в 'Preload State'
    this.load.onLoadComplete.addOnce(utils.proceedToState.bind(this, 'Preload'));
  }

   _getAssetResolution() {
    const dpi = window.devicePixelRatio;
    return dpi >= 2.5 ? '@3x' : dpi > 1.5 ? '@2x' : '';
  }

  _isIphone4() {
    if (navigator && navigator.userAgent) {
      return /iPhone/i.test(navigator.userAgent) && window.screen.height === (960 / 2);
    }

    return false;
  }

  _isAndroid4() {
    if (navigator && navigator.userAgent) {
      return /Android\s4/.test(navigator.userAgent);
    }

    return false;
  }
}
