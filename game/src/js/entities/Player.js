(function(){
'use strict';
  var BASE_HP = 10;
  var BASE_SPEED = 150; // pixels/second
  var MAX_SPEED_Y = 500; // pixels/second
  var YSPEED = 350;
  var MOVE_ACCELERATION = BASE_SPEED*5; // pixels/second/second
  var GRAVITY = 1200;
  var JUMP_BACK_OFF = 400;
  var DOUBLE_TAP_RATE = 400;
  var DASH_COOLDOWN = 1000;

  GameCtrl.Player = function(game, tilesCollision){
    this.game = game;
    this.tilesCollision = tilesCollision;
    this.physics = game.physics;
    this.add = game.add;
    this.sprite = null;
    this.keyboard = this.game.input.keyboard;


    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.W, Phaser.Keyboard.A,
      /*Phaser.Keyboard.S,*/ Phaser.Keyboard.D
    ]);

    this.game.input.gamepad.start();
    this.pad1 = this.game.input.gamepad.pad1;

    this.canJump = true;
    this.canDoubleJump = false;

    this.dashTime = 0;
    this.lDashPress = 100;
    this.rDashPress = 100;

    this.health = BASE_HP;
    this.moveSpeed = BASE_SPEED;

    this.skills = {
      DOUBLE_JUMP: true,
      DASH: true,
      WALL_CLIMB: true
    };
  }

GameCtrl.Player.prototype = {
  create: function (x, y) {

    var s = this.game.add.sprite(32,32,null);
    s.anchor.setTo(.5);

    s.arm = this.game.add.sprite(3,-5, 'heroarm');
    s.arm.anchor.setTo(0.1, 0.9);
    s.addChild(s.arm);

    s.torso = this.game.add.sprite(0, 0, 'player');
    s.torso.anchor.setTo(.5);
    s.addChild(s.torso);

    s.torso.animations.add('walk', [1, 2, 3, 4], 6);
    s.torso.animations.add('rWalk', [4, 3, 2, 1], 6);

    this.sprite = s;

    this.physics.enable(s,Phaser.Physics.ARCADE,true);

    s.lastX=Math.floor(x);
    s.lastY=Math.floor(y);
    s.body.maxVelocity.setTo(this.moveSpeed, MAX_SPEED_Y); // x, y

    s.body.collideWorldBounds = true;
    s.body.gravity.set(0, GRAVITY);
    s.body.allowGravity = true;
    s.body.speedxPunish=0;

    this.sprite.body.width = 16;

    this.game.camera.follow(s, Phaser.Camera.FOLLOW_PLATFORMER);

    this.cursors = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    this.cursors.up.onDown.add(this.dJumpCheck, this);

    this.cursors.left.onDown.add(function() {
      if(this.game.time.now - this.lDashPress < DOUBLE_TAP_RATE) {
        this.dash('left');
      }
      this.lDashPress = this.game.time.now;
    }, this);
    this.cursors.right.onDown.add(function() {
      if(this.game.time.now - this.rDashPress < DOUBLE_TAP_RATE) {
        this.dash('right');
      }
      this.rDashPress = this.game.time.now;
    }, this);

  },
  update: function() {
    var body = this.sprite.body;

    body.acceleration.x=0;
    if(body.blocked.down){
      body.velocity.x = 0+body.velocityPunish.x;
    }

    if(this.game.input.activePointer.worldX < this.sprite.x) {
        this.sprite.scale.x = -1;
        this.sprite.arm.scale.x = -1;
        this.sprite.arm.scale.y = -1;
    }else {
        this.sprite.scale.x = 1;
        this.sprite.arm.scale.x = 1;
        this.sprite.arm.scale.y = 1;
    }

    this.sprite.arm.rotation = this.sprite.scale.x * this.game.math.angleBetween(
        this.sprite.x, this.sprite.y,
        this.game.input.activePointer.worldX, this.game.input.activePointer.worldY
    );


    var LEFT = false||this.cursors.left.isDown;
    var RIGHT = false||this.cursors.right.isDown;
    var UP = false||this.cursors.up.isDown;

    if(!RIGHT && LEFT){
      this.go('left');
      this.sprite.torso.animations.play(this.sprite.scale.x > -1 ? 'rWalk' : 'walk');
    }else if (!LEFT && RIGHT){
      this.go('right');
      this.sprite.torso.animations.play(this.sprite.scale.x < 1 ? 'rWalk' : 'walk');
    }else{
      this.sprite.torso.animations.stop();

      this.sprite.torso.frame = 0;
    }

    //var isInAir=(!body.blocked.down && !body.blocked.left && !body.blocked.right);
    var isInAir=(!body.blocked.down);

    if (!isInAir && UP && this.canJump) {
      this.canDoubleJump = true;
      this.jump();
    }

    if(!UP){

      this.canJump=true;

      // stop jumping!
      if (isInAir && body.velocity.y < 0){
        body.velocity.y=0;
      }
    }

    body.gravity.set(0, GRAVITY);

    if(body.deltaY() > 0){
      var _mapData = this.tilesCollision.getTiles(
        body.position.x - body.tilePadding.x,
        body.position.y ,
        body.width + body.tilePadding.x,
        body.height,
        false, false);


      for (var i = 0; i < _mapData.length; i += 1) {
        var t = _mapData[i];
        if (t.hasOwnProperty('slopeIndex') && t.slopeIndex === 1) {

          if( this.sprite.x - (t.worldX + t.width)< 10 ) {
            body.gravity.set(0, GRAVITY/10);

            break;
          } else if( this.sprite.world.x + this.sprite.width - t.right < 10 ){
              this.sprite.body.gravity.set(0, GRAVITY/10);
              console.log(this.sprite.world.x + this.sprite.width - t.right);
              break;
          }
        }
      }
    }
  },

  dJumpCheck: function() {
    if(!this.sprite.body.blocked.down && this.canDoubleJump) {
      this.jump();
      this.canDoubleJump = false;
    }
  },
  jump: function() {

    this.canJump = false;

    // wall jump
    /*if (!this.sprite.body.blocked.down) {
      if (this.sprite.body.blocked.left) {
        this.sprite.body.velocity.x = -this.sprite.body.velocity.x + JUMP_BACK_OFF;
      }
      if (this.sprite.body.blocked.right) {
        this.sprite.body.velocity.x = -this.sprite.body.velocity.x - JUMP_BACK_OFF;
      }
    }*/
    this.sprite.body.velocity.y = -YSPEED;

  },

  dash: function(direction) {
    var sign = (direction==='left') ? '-' : '';

    var s = this.sprite;
    var defaultSpeed = this.moveSpeed;
    var tween = this.game.add.tween(this.sprite.body.velocity)
      .to( { x: sign + 50000 }, 200, Phaser.Easing.Linear.None, false )
      .to( { x: 0 }, 50, Phaser.Easing.Linear.None, false);
      tween.onStart.add(function() {
        s.body.maxVelocity.setTo(750, MAX_SPEED_Y); // x, y
      });
      tween.onComplete.add(function() {
        s.body.maxVelocity.setTo(defaultSpeed, MAX_SPEED_Y); // x, y
      });
      tween.start();
  },

  go: function(direction) {
    var sign = (direction==='left') ? -1 : 1;

    var _bonus = 1;

    //this.sprite.body.acceleration.x=sign*MOVE_ACCELERATION;
    if(this.sprite.body.blocked.down){
      this.sprite.body.velocity.x = sign * this.moveSpeed * _bonus +this.sprite.body.speedxPunish;
    } else {
      this.sprite.body.acceleration.x = sign * MOVE_ACCELERATION * _bonus;

      /*if ((this.sprite.body.blocked.left || this.sprite.body.blocked.right) && this.sprite.body.velocity.y > -MAX_SPEED_Y *0.8 ){

        this.sprite.body.velocity.y=0;
      }*/
    }


  },
  stop: function() {
    this.sprite.body.acceleration.x=0;
  }
};

}());