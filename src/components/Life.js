import Phaser from 'phaser';

export default class extends Phaser.Sprite {
  constructor({ game, x, y, key }) {
    super(game, x, y, key);
    this.game = game;

    this.game.add.existing(this);
  }
}