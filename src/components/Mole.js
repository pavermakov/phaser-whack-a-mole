import Phaser from 'phaser';

export default class extends Phaser.Sprite {
  constructor({ game, x, y, key, anchor, scale }) {
    super(game, x, y, key);

    this.game = game;
    this.anchor.setTo(anchor.x, anchor.y);
    this.scale.setTo(scale);
    this.inputEnabled = true;

    this.data = {
      tween: null,
      isHidden: true,
      whacked: false,
      timer: this.game.time.create(false),
    };
    
    this._initMask();
    this._initEvents();

    this.game.add.existing(this);
    this._scheduleNextReveal();
  }

  _initMask() {
    // инициализируем область видимости
    const mask = game.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawRect(this.left, this.top, this.width, this.height);
    this.mask = mask;
    // передвигаем крота за область видимости
    this.y += this.height;
  }

  _initEvents() {
    this.events.onInputDown.add(this._whack, this);
  }

  _scheduleNextReveal() {
    const interval = this.game.rnd.integerInRange(500, 1600);
    this.data.timer.add(interval, this._toggleMole, this);
    this.data.timer.start();
  }

  _toggleMole() {
    const distance = this.data.isHidden ? -this.height : this.height;
    const easing = this.data.isHidden ? Phaser.Easing.Bounce.Out : Phaser.Easing.Linear.None;
    const timing = this.data.isHidden ? 300 : 100;

    this.data.tween = game.add.tween(this).to({ y: `${distance}`}, timing, easing, true);

    if(!this.data.whacked) {
      this.data.tween.onComplete.add(this._scheduleNextReveal, this);
    } else {
      this.data.whacked = false;
    }

    this.data.isHidden = !this.data.isHidden;
  }

  _whack() {
    if(this.data.isHidden || this.data.whacked) return;

    this.data.whacked = true;
    
    this._toggleMole();
  }
}