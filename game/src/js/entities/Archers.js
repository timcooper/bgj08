(function(){
'use strict';

GameCtrl.Archers = function(game){
  this.game = game;

  this.troopCount = 0;
  this.orderRate = 400;
  this.range = 10;
  this.damage = .5;

  this.nextOrder = 0;
};

GameCtrl.Archers.prototype = {
  attack: function(player) {
    if(this.troopCount > 0) {
      if (this.game.time.now > this.nextOrder && this.troops.countDead() > 0)
      {
          this.nextOrder = this.game.time.now + this.orderRate;

          var troop = this.troops.getFirstExists(false);

          if(troop) {
            troop.reset(player.sprite.x + 5, player.sprite.y);
            troop.lifespan = this.range * 100;

            troop.scale.x = player.sprite.scale.x;

            this.game.physics.arcade.moveToPointer(troop, 400);
            troop.rotation = this.game.physics.arcade.angleToPointer(troop);

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

      this.troops.createMultiple(30, 'arrow');
      this.troops.setAll('anchor.x', 0.5);
      this.troops.setAll('anchor.y', 0.5);
  },

  update: function () {

  }
};

}());
