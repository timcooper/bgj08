(function(){
'use strict';

GameCtrl.Pickups = function(game){
  Phaser.Group.call(this, game);
  this.map = map;

  this.enableBody = true;
  this.physicsBodyType = Phaser.Physics.ARCADE;
  this.enableBounce = true;
};


GameCtrl.Pickups.prototype = Object.create(Phaser.Group.prototype);
GameCtrl.Pickups.prototype.constructor = GameCtrl.Pickups;

GameCtrl.Pickups.prototype.spawnEnemyLoot = function(x, y) {
  var pickup = this.create(x, y-10, 'pickups', this.game.rnd.integerInRange(0, 1));
  this.game.add.tween(pickup).to( { y: y-5 }, 500, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
}

GameCtrl.Pickups.prototype.spawnDestrLoot = function(x, y) {
  var pickup = this.create(x+5, y-15, 'pickups', this.game.rnd.integerInRange(0, 11));
  this.game.add.tween(pickup).to( { y: y-10 }, 500, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
}

}());
