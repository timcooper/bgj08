(function(){
'use strict';

GameCtrl.Berserkers = function(ctx){
  this.game = ctx.game;
  this.player = ctx;

  this.troopCount = 0;
  this.orderRate = 1000;
  this.range = 1;
  this.damage = 4;

  this.nextOrder = 0;
};

GameCtrl.Berserkers.prototype = {
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

      this.troops.createMultiple(30, 'berserker');
      this.troops.setAll('anchor.x', 0.5);
      this.troops.setAll('anchor.y', 0.5);
  },

  update: function () {
    if(this.troopCount > 0) {
      if (this.game.time.now > this.nextOrder && this.troops.countDead() > 0)
      {
          this.nextOrder = this.game.time.now + this.orderRate;

          for(var i = 0; i < 4; i++) {
            var troop = this.troops.getFirstExists(false);

            if(troop) {
              troop.lastHit = null;
              troop.reset(this.player.sprite.x + 5, this.player.sprite.y);
              troop.lifespan = this.range*400;

              switch(i) {
                case 0:
                  troop.scale.x = this.player.sprite.scale.x;
                  troop.body.velocity.x = -100;
                  break;
                case 1:
                  troop.scale.x = -this.player.sprite.scale.x;
                  troop.body.velocity.x = 100;
                  break;
                case 2:
                  troop.scale.x = -this.player.sprite.scale.x;
                  troop.body.velocity.x = -50;
                  break;
                case 3:
                  troop.scale.x = this.player.sprite.scale.x;
                  troop.body.velocity.x = 50;
                  break;
              }
              troop.immovable = true;
            }
          }
          this.troopCount--;
      }
    }

    this.game.physics.arcade.overlap(this.troops, this.player.enemies.enemies[0].slimes, this.hit, null, this );

  },

  hit: function (callee, enemy) {
    if(callee.lastHit != enemy) enemy.damage(this.damage);
    enemy.body.velocity.x = callee.body.velocity.x * 0.4;
    callee.lastHit = enemy;
  }
};

}());
