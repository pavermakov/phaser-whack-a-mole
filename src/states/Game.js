/* globals __DEV__ */
import Phaser from 'phaser';
import Hole from '../components/Hole';
import Mole from '../components/Mole';

export default class extends Phaser.State {
  init() {
    this._score = 0;
    this._level = 1;
  }

  create() {
    // задний фон
    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'grass');

    this.holes = this._initHoles();
    this.moles = this._initMoles();
  }

  _initHoles() {
    const holes = this.add.group();
    const originalWidth = this.cache.getImage('hole').width;
    const scaleFactor = (this.world.width / 3.333) / originalWidth;
    const holeGap = originalWidth * scaleFactor;
    const startPoint = {
      x: this.world.centerX - holeGap,
      y: this.world.centerY - holeGap,
    };

    for(let i = 0; i < 3; i += 1) {
      for(let j = 0; j < 3; j += 1) {
        holes.add(new Hole({
          game: this,
          x: startPoint.x + Math.round(i * holeGap),
          y: startPoint.y + Math.round(j * holeGap),
          key: 'hole',
          scale: scaleFactor,
        }));
      }
    }

    return holes;
  }

  _initMoles() {
    const moles = this.add.group();
    const originalWidth = this.cache.getImage('mole').width;
    const holeWidth = this.holes.getAt(0).width;
    const scaleFactor = (holeWidth * 0.5) / originalWidth;

    this.holes.forEach((hole) => {
      var mole = moles.add(new Mole({
        game: this,
        x: hole.centerX,
        y: hole.centerY,
        key: 'mole',
        anchor: {
          x: 0.5,
          y: 1.15,
        },
        scale: scaleFactor,
      }));
    }, this);

    return moles;
  }

  _increaseScore() {
    this._score += 1;
  }
}
