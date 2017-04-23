import Phaser from 'phaser';

export default class extends Phaser.Image {
  constructor({ game, x, y, key, scale }) {
    super(game, x, y, key);

    this.anchor.setTo(0.5);
    this.scale.setTo(scale);

    game.add.existing(this);
  }
}