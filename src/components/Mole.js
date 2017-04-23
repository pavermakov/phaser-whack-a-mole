import Phaser from 'phaser';

export default class extends Phaser.Sprite {
  constructor({ game, x, y, key, anchor, scale }) {
    super(game, x, y, key);

    this.anchor.setTo(anchor.x, anchor.y);
    this.scale.setTo(scale);
    this.inputEnabled = true;

    this.data.tween = null;
    this.data.isHidden = true;
    this.data.timer = game.time.create(false);
    
    this._initMask();
    this.y += this.height;

    game.add.existing(this);
    this._scheduleNextReveal();
  }

  _initMask() {
    // инициализируем область за которой прячем объект (крот)
    const mask = game.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawRect(this.left, this.top, this.width, this.height);
    this.mask = mask;
  }

  _scheduleNextReveal() {
    const interval = game.rnd.integerInRange(500, 3000);
    this.data.timer.add(interval, this._toggleMole, this);
    this.data.timer.start();
  }

  _toggleMole(callback) {
    const distance = this.data.isHidden ? -this.height : this.height;
    const easing = this.data.isHidden ? Phaser.Easing.Bounce.Out : Phaser.Easing.Linear.None;
    const timing = this.data.isHidden ? 300 : 100;

    this.data.isHidden = !this.data.isHidden;
    this.data.tween = game.add.tween(this).to({ y: `${distance}`}, timing, easing, true);
    this.data.tween.onComplete.add(this._scheduleNextReveal, this);
  }
}