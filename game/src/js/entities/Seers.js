(function(){
'use strict';

GameCtrl.Seers = function(game){
  this.game = game;

  this.troopCount = 0;
  this.orderRate = 500;
  this.range = 5;
  this.damage = 1;

  this.nextOrder = 0;
};

GameCtrl.Seers.prototype = {
  attack: function(player) {
    if(this.troopCount > 0) {
      if (this.game.time.now > this.nextOrder && this.troops.countDead() > 0)
      {
          this.nextOrder = this.game.time.now + this.orderRate;

          var swordsman = this.troops.getFirstExists(false);

          if(swordsman) {
            swordsman.reset(player.sprite.x + 5, player.sprite.y);
            swordsman.lifespan = 500;

            swordsman.scale.x = player.sprite.scale.x;
            swordsman.body.velocity.x = player.sprite.scale.x * 500;

            this.troopCount--;
          }
      }
    }
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

  }
};

}());
