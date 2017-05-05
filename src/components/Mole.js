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
      tweenEvent: null,
      isBelow: true,
      whacked: false,
      location: {
        above: Math.round(this.y),
        below: Math.round(this.y + this.height),
        over: -this.height,
      },
      timer: this.game.time.create(false),
      timerEvent: null,
    };
    
    this._initMask();
    this._initEvents();

    this.game.add.existing(this);
  }

  _initMask() {
    // инициализируем область видимости
    const mask = game.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    // mask.drawRect(this.left, this.top, this.width, this.height);
    mask.drawRect(this.left, 0, this.width, this.bottom);
    this.mask = mask;
    // передвигаем крота за область видимости
    this.y += this.height;
  }

  _initEvents() {
    this.events.onInputDown.add(this._whack, this);
  }

  _scheduleNextMove() {
    const { min, max } = this.game._spawnTimeRange;
    const delay = this.game.rnd.integerInRange(min, max);

    if (this.data.isBelow) {
      if (this.game._activeMolesNum >= this.game._maxMolesNum) {
        this.data.timerEvent = this.data.timer.add(delay, this._scheduleNextMove, this);
      } else {
        // this part is called initially
        this.game._increaseActiveMoles();
        this.data.timerEvent = this.data.timer.add(delay, this._toggleMole, this);  
      }
    } else {
      this.data.timerEvent = this.data.timer.add(delay, this._toggleMole, this);
      // this.data.timer.onComplete.addOnce(this.game._decreaseActiveMoles, this.game);
    }

    this.data.timer.start(); 
  }

  _toggleMole() {
    let location, easing, timing, callback;

    if (this.data.isBelow) {
      // getting out of hole
      this.data.isBelow = false;
      this.inputEnabled = true;
      
      location = this.data.location.above;
      easing = Phaser.Easing.Bounce.Out;
      timing = 300;
      callback = this._scheduleNextMove; // add callback to it
    } else if(!this.data.isBelow && !this.data.whacked) {
      // player failed, flying over the screen (or something)
      location = this.data.location.over;
      easing = Phaser.Easing.Linear.None;
      timing = 400;
      callback = this._resetBomb;

      this.inputEnabled = false;
      this.game._decreaseActiveMoles();
      this.game._decreaseLives();
      this.game.ui._popLifeIcon();
    } else if (!this.data.isBelow && this.data.whacked) {
      // player succeded, put the bomb back
      location = this.data.location.below;
      easing = Phaser.Easing.Linear.None;
      timing = 100;
      callback = this._scheduleNextMove;

      this.data.isBelow = true;
      this.data.whacked = false;
      this.game._decreaseActiveMoles();
    }
    
    this.data.tween = this.game.add.tween(this).to({ y: location }, timing, easing);
    this.data.tweenEvent = this.data.tween.onComplete.add(callback, this);
    
    this.data.tween.start();
  }

  _resetBomb() {
    this.data.isBelow = true;
    this.data.whacked = false;
    this.inputEnabled = true;
    this.top = this.data.location.below;
    this._scheduleNextMove();
  }

  _whack() {
    console.log(this.data.isBelow);
    if(this.data.isBelow || this.data.whacked) return;

    this.data.whacked = true;
    // toggling the object with force
    this.data.tween.pause();
    this.data.timerEvent.callback = this._doNothing;
    this._toggleMole();

    this._showHammer();
    this.game._increaseScore();
  }

  _showHammer() {
    const { hammer, input } = this.game;

    [hammer.x, hammer.y] = [input.activePointer.x, input.activePointer.y];
    hammer._hit();
  }

  _doNothing() {
    return;
  }
}