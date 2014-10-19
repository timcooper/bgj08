(function(){
'use strict';

GameCtrl.Swordsmen = function(ctx){
  this.game = ctx.game;
  this.player = ctx;

  this.troopCount = 0;
  this.orderRate = 500;
  this.range = 5;
  this.damage = 1;

  this.nextOrder = 0;
};

GameCtrl.Swordsmen.prototype = {
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

      this.troops.createMultiple(30, 'swordsman');
      this.troops.setAll('anchor.x', 0.5);
      this.troops.setAll('anchor.y', 0.5);
      //this.troops.setAll('outOfBoundsKill', true);
      //this.troops.setAll('checkWorldBounds', true);

      this.troops.enableBody = true;
      this.troops.physicsBodyType = Phaser.Physics.ARCADE;
  },

  update: function () {
    if(this.troopCount > 0) {
      if (this.game.time.now > this.nextOrder && this.troops.countDead() > 0)
      {
          this.nextOrder = this.game.time.now + this.orderRate;

          var troop = this.troops.getFirstExists(false);

          if(troop) {
            troop.reset(this.player.sprite.x + 5, this.player.sprite.y);
            troop.lifespan = this.range * 100;

            troop.scale.x = this.player.sprite.scale.x;
            troop.body.velocity.x = this.player.sprite.scale.x * 250;
            troop.immovable = true;

            this.troopCount--;
          }
      }
    }

    //this.game.physics.arcade.overlap(this.troops, this.player.enemies, null, function() { console.log('hit') }, this);
    //for (var i = 0; i < this.player.enemies.enemies.length; i += 1) {
      this.game.physics.arcade.overlap(this.troops, this.player.enemies.enemies[0].slimes, this.hit, null, this );
    //}

  },

  hit: function (callee, enemy) {
    console.log(this.lastHit);
    if(this.lastHit != enemy) enemy.damage(this.damage);
    this.lastHit = enemy;
  }
};

}());
