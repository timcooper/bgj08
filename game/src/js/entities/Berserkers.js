(function(){
'use strict';

GameCtrl.Berserkers = function(game){
  this.game = game;

  this.troopCount = 0;
  this.orderRate = 1000;
  this.range = 1;
  this.damage = 4;

  this.nextOrder = 0;
};

GameCtrl.Berserkers.prototype = {
  attack: function(player) {
    if(this.troopCount > 0) {
      if (this.game.time.now > this.nextOrder && this.troops.countDead() > 0)
      {
          this.nextOrder = this.game.time.now + this.orderRate;

          for(var i = 0; i < 4; i++) {
            var troop = this.troops.getFirstExists(false);

            if(troop) {
              troop.reset(player.sprite.x + 5, player.sprite.y);
              troop.lifespan = this.range*400;

              switch(i) {
                case 0:
                  troop.scale.x = player.sprite.scale.x;
                  troop.body.velocity.x = -100;
                  break;
                case 1:
                  troop.scale.x = -player.sprite.scale.x;
                  troop.body.velocity.x = 100;
                  break;
                case 2:
                  troop.scale.x = -player.sprite.scale.x;
                  troop.body.velocity.x = -50;
                  break;
                case 3:
                  troop.scale.x = player.sprite.scale.x;
                  troop.body.velocity.x = 50;
                  break;
              }
            }
          }
          this.troopCount--;
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

      this.troops.createMultiple(30, 'berserker');
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
