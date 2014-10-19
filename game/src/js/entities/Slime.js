(function(){
'use strict';

GameCtrl.Slime = function(game, player, pickups){
  this.game = game;
  this.player = player;
  this.pickups = pickups;

  this.attackRate = 1000;
  this.range = 0;
  this.damage = .5;

  this.nextAttack = 0;

  this.health = 2;
};

GameCtrl.Slime.prototype = {
  spawn: function(x, y) {
    if (this.slimes.countDead() > 0)
    {
      var enemy = this.slimes.getFirstExists(false);

      if(enemy) {
        enemy.reset(x, y);
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.enableBody = true;
        enemy.enableBounce = true;
        enemy.body.bounce.y = 0.5;
        enemy.body.collideWorldBounds = true;
        enemy.body.gravity.y = 500;
        enemy.body.maxVelocity = 50;
        enemy.body.velocity.x = 50;
        enemy.health = 2;

        enemy.events.onKilled.add(function() {
          this.pickups.spawnEnemyLoot(enemy.x, enemy.y);
        }.bind(this));
      }
    }
  },

  create: function (amount) {
    amount = amount||30;

    this.slimes = game.add.group();

    this.slimes.createMultiple(amount, 'slime');
    this.slimes.setAll('anchor.x', 0.5);
    this.slimes.setAll('anchor.y', 0.5);

    this.slimes.callAll('animations.add', 'animations', 'bounce', null, 6, true);
    this.slimes.callAll('play', null, 'bounce');
  },

  update: function (player, level) {
    //this.game.physics.arcade.collide(this.slimes, player.sprite, null, this.collidePlayer, this);
    this.game.physics.arcade.collide(this.slimes, player.sprite, null, this.collidePlayer, this);
    this.game.physics.arcade.collide(this.slimes, level, null, this.collideLevel);
  },

  hurt: function(callee, caller) {
    if(this.currentHealth - damage > 0 && this.isHurtable) {
      this.currentHealth -= damage;

      this.hurtTime = this.game.time.now;
      this.isHurtable = false;

      this.sprite.torso.tint = 0xff0000;
      this.sprite.arm.tint = 0xff0000;

      console.log("Player hurt for " + damage + " damage, " + this.currentHealth + " HP left.");
    }else{
      console.log("UDIED");
    }
  },

  collidePlayer: function(callee, caller) {
    if(this.player.isHurtable && this.game.time.now > this.nextAttack) {
      this.nextAttack = this.game.time.now + this.attackRate;

      this.player.hurt(this.damage);
    }
  },

  collideLevel: function(slime, caller) {
    if(slime.body.blocked.right) slime.body.velocity.x = -50;
    if(slime.body.blocked.left) slime.body.velocity.x = 50;

    if(slime.body.velocity.x !== 50 || slime.body.velocity.x !== -50) slime.body.acceleration = 25;
  }
};

}());
