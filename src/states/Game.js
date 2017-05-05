import Phaser from 'phaser';
import Hole from '../components/Hole';
import Mole from '../components/Mole';
import Hammer from '../components/Hammer';
import UI from '../components/UI';
import utils from '../utils';

export default class extends Phaser.State {
  init() {
    this._score = 0;
    this._lives = 3;
    this._maxMolesNum = 1;
    this._activeMolesNum = 0;
    this._nextLevelUpTime = 5000;
    this._spawnTimeRange = {
      min: 1000, 
      max: 2500,
    };
    this._gameTimer = this.time.create(false);
  }

  create() {
    // задний фон
    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'grass');

    this.ui = new UI(this);
    this.holes = this._createHoles();
    this.moles = this._createMoles();
    this.hammer = this._createHammer();   

    this._start();
  }

  _start() {
    this._scheduleNextLevelUp();
    this.moles.forEach(mole =>  mole._scheduleNextMove(), this);
  }

  _levelUp() {
    console.log('level up');
    this._maxMolesNum += 1;
    this._nextLevelUpTime *= 2.5;
    this._spawnTimeRange.min -= 50;
    this._spawnTimeRange.max -= 50;

    this._scheduleNextLevelUp();
  }

  _createHoles() {
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

  _createMoles() {
    const moles = this.add.group();
    const originalWidth = this.cache.getImage('mole').width;
    const holeWidth = this.holes.getAt(0).width;
    const scaleFactor = (holeWidth * 0.5) / originalWidth;

    this.holes.forEach((hole) => {
      moles.add(new Mole({
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

    return utils.shuffle(moles.children);
  }

  _createHammer() {
    const originalWidth = this.cache.getImage('hammer').width;
    const scaleFactor = (this.world.width / 7) / originalWidth;

    return new Hammer({
      game: this,
      key: 'hammer',
      anchor: {
        x: 0,
        y: 1,
      },
      scale: scaleFactor,
    });
  }

  _scheduleNextLevelUp() {
    this._gameTimer.add(this._nextLevelUpTime, this._levelUp, this);
    this._gameTimer.start();
  }

  _increaseScore() {
    this._score += 1;
  }

  _increaseActiveMoles() {
    if (this._activeMolesNum < this._maxMolesNum) {
      this._activeMolesNum += 1;
    }  
  }

  _decreaseActiveMoles() {
    if (this._activeMolesNum > 0) {
      this._activeMolesNum -= 1;
    }
  }

  _decreaseLives() {
    if (this._lives > 0) {
      this._lives -= 1;
    }
  }
}
