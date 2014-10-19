(function(){
'use strict';

GameCtrl.Archers = function(ctx){
  this.game = ctx.game;
  this.player = ctx;

  this.troopCount = 0;
  this.orderRate = 400;
  this.range = 10;
  this.damage = .5;

  this.nextOrder = 0;
};

GameCtrl.Archers.prototype = {
  attack: function(player) {
    this.update();
  },

  addTroops: function(amount) {
    this.troopCount += amount;
  },

  create: function () {
      this.troops = game.add.group();

      this.troops.enableBody = true;
      this.troops.physicsBodyType = Phaser.Physics.ARCADE;

      this.troops.createMultiple(30, 'arrow');
      this.troops.setAll('anchor.x', 0.5);
      this.troops.setAll('anchor.y', 0.5);
  },

  update: function () {
    if(this.troopCount > 0) {
      if (this.game.time.now > this.nextOrder && this.troops.countDead() > 0)
      {
          this.nextOrder = this.game.time.now + this.orderRate;

          var troop = this.troops.getFirstExists(false);

          if(troop) {
            troop.lastHit = null;
            troop.reset(this.player.sprite.x + 5, this.player.sprite.y);
            troop.lifespan = this.range * 100;

            troop.scale.x = this.player.sprite.scale.x;

            this.game.physics.arcade.moveToPointer(troop, 400);
            troop.rotation = this.game.physics.arcade.angleToPointer(troop);

            troop.immovable = true;

            this.troopCount--;
          }
      }
    }

    this.game.physics.arcade.overlap(this.troops, this.player.enemies.enemies[0].slimes, this.hit, null, this );
    this.game.physics.arcade.overlap(this.troops, this.player.destructibles, this.hitD, null, this );

  },

  hitD: function (callee, dest) {
    dest.kill();
  },

  hit: function (callee, enemy) {
    if(callee.lastHit != enemy) enemy.damage(this.damage);
    enemy.body.velocity.x = callee.body.velocity.x * 0.05;
    callee.lastHit = enemy;
  }

};

}());
