(function(){
'use strict';

GameCtrl.Destructibles = function(game, map, pickups){
  Phaser.Group.call(this, game);
  this.map = map;
  this.pickups = pickups;

  this.spawnPoints = this.map.objects.destructibleSpawn;
  console.log(this.spawnPoints);
  this.map.createFromObjects('destructibleSpawn', 50, 'skullnest1', 0, true, false, this, Phaser.Sprite, true);

  this.forEach(function (item) {
    console.log(item);
      game.physics.arcade.enable(item);
      item.body.immovable = true;
      item.kill = function() {
        item.body = null;
        item.frame = 1;
        this.pickups.spawnDestrLoot(item.x, item.y);
      }.bind(this);
  }, this, false);
};


GameCtrl.Destructibles.prototype = Object.create(Phaser.Group.prototype);
GameCtrl.Destructibles.prototype.constructor = GameCtrl.Destructibles;

}());
