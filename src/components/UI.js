import Phaser from 'phaser';
import Life from './Life';

export default class extends Phaser.Group {
  constructor(game) {
    super(game);

    this.game = game;
    this.lives = this.game._lives;

    this._createLives();
    this.game.add.existing(this);
  }

  _createLives() {
    const lives = this.game.add.group();

    for (let i = 0; i < this.lives; i += 1) {
      lives.create(new Life({
        game: this.game,
        x: 5 + i * 50,
        y: 5,
        key: 'life',
      }));
    }

    this.add(lives);
  }

  _popLifeIcon() {
    // give name to the group, simplify
    if (this.children[0].length > 0) {
      this.children[0].getChildAt(2).scale.setTo(2);
    }
  }
}