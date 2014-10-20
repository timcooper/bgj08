(function(){
'use strict';

GameCtrl.Bat = function(game, player, pickups){
  this.game = game;
  this.player = player;
  this.pickups = pickups;

  this.attackRate = 1000;
  this.range = 0;
  this.damage = 2;

  this.nextAttack = 0;

  this.health = 1;
};

GameCtrl.Bat.prototype = {
  spawn: function(x, y) {
    if (this.bats.countDead() > 0)
    {
      var enemy = this.bats.getFirstExists(false);

      if(enemy) {
        enemy.reset(x, y - 10);
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.enableBody = true;
        enemy.enableBounce = true;
        enemy.body.bounce.y = 0.5;
        enemy.body.collideWorldBounds = true;
        enemy.body.maxVelocity = 50;
        enemy.body.velocity.y = (Math.random() < 0.5 ? -1 : 1) * 50;
        //enemy.body.velocity.x = 50;
        enemy.health = 2;

        enemy.events.onKilled.add(function() {
          this.pickups.spawnEnemyLoot(enemy.x, enemy.y);
        }.bind(this));
      }
    }
  },

  create: function (amount) {
    amount = amount||30;

    this.bats = game.add.group();

    this.bats.createMultiple(amount, 'bat');
    this.bats.setAll('anchor.x', 0.5);
    this.bats.setAll('anchor.y', 0.5);

    this.bats.callAll('animations.add', 'animations', 'flap', null, 6, true);
    this.bats.callAll('play', null, 'flap');
  },

  update: function (player, level) {
    this.bats.forEachExists(function(bat) {
      bat.body.velocity.x = 0;
      if(bat.tint == 0xff0000 && this.game.time.now > bat.hurtTime + 100) {
        bat.tint = 0xffffff;
      }
    }, this);
    /*this.bats.forEachAlive(function (item) {
      this.game.add.tween(item.body.velocity).to( { y: -50 }, 500, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
    }, this, false);*/

    this.game.physics.arcade.collide(this.bats, player.sprite, null, this.collidePlayer, this);
    this.game.physics.arcade.collide(this.bats, level, null, this.collideLevel);
  },

  collidePlayer: function(callee, caller) {
    if(this.player.isHurtable && this.game.time.now > this.nextAttack) {
      this.nextAttack = this.game.time.now + this.attackRate;

      this.player.hurt(this.damage);
    }
  },

  collideLevel: function(bat, caller) {
    if(bat.body.blocked.up) bat.body.velocity.y = 50;
    if(bat.body.blocked.down) bat.body.velocity.y = -50

    if(bat.body.velocity.y !== 50 || bat.body.velocity.y !== -50) bat.body.acceleration = 25;
  }
};

}());
