(function(){
'use strict';

GameCtrl.Destructibles = function(game, map){
  Phaser.Group.call(this, game);
  this.map = map;

  this.spawnPoints = this.map.objects.destructibleSpawn;

  this.map.createFromObjects('destructibleSpawn', 41, 'skullnest1', 0, true, false, this, Phaser.Sprite, true);

  this.forEach(function (item) {
      game.physics.arcade.enable(item);
      item.body.immovable = true;
      item.kill = function() {
        item.frame = 1;
      }
  }, this, false);
};


GameCtrl.Destructibles.prototype = Object.create(Phaser.Group.prototype);
GameCtrl.Destructibles.prototype.constructor = GameCtrl.Destructibles;

}());
