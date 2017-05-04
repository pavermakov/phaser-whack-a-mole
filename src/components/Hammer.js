import Phaser from 'phaser';

export default class extends Phaser.Sprite {
  constructor({ game, x = 0, y = 0, key, anchor, scale }) {
    super(game, x, y, key);

    this.game = game;
    this.anchor.setTo(anchor.x, anchor.y);
    this.scale.setTo(scale);
    this.pivot.x = this.centerX - 25;
    this.pivot.y = this.centerY - 5;
    this.alpha = 0;

    this.data.tween = this.game.add.tween(this).to({ rotation: [-1.2, 0] }, 225, Phaser.Easing.Linear.None);
    this.data.tween.onComplete.add(this._hide, this);

    this.game.add.existing(this);
  }

  _hit() {
    if (!this.data.tween.isRunning) {
      this.alpha = 1;
      this.data.tween.start();
    }
  }

  _hide() {
    this.game.time.events.add(50, () => this.alpha = 0, this);
  }
}