(function(){
'use strict';

GameCtrl.Enemies = function(game, player, map, pickups){
  this.game = game;
  this.player = player;
  this.map = map;
  this.pickups = pickups;

  this.spawnRate = 1000;
  this.nextSpawn = 100;

  this.totalEnemies = 200;
  this.currentEnemies = 0;

  this.canSpawn = true;
};

GameCtrl.Enemies.prototype = {
  spawn: function() {
    if(this.canSpawn) {
      if (this.game.time.now > this.nextSpawn && this.currentEnemies <= this.totalEnemies)
      {
          this.nextSpawn = this.game.time.now + this.spawnRate;

          //var spawnBox = new Phaser.Rectangle(player.x, player.y, 200, 200);

          for (var i = 0; i < this.spawnPoints.length; i += 1) {
            //if(spawnBox.contains(this.spawnPoints[i].x, this.spawnPoints[i].y)) {
            this.enemies[this.game.rnd.integerInRange(0,1)].spawn(this.spawnPoints[i].x, this.spawnPoints[i].y, 5);
            this.currentEnemies+5;
            //}
          }

          /*for (var i = 0; i < this.enemies.length; i += 1) {
            this.enemies[i].spawn(player.x, player.y);
          }*/
      }
    }
  },

  create: function () {

      this.reverseTriggers = this.game.add.group();
      this.map.createFromObjects('slimeBarrier', 48, null, 0, true, false, this.reverseTriggers, Phaser.Sprite, true);

      this.reverseTriggers.forEach(function (item) {
          game.physics.arcade.enable(item);
          item.width = 16;
          item.body.immovable = true;
      }, this, false);

      this.spawnPoints = this.map.objects.enemySpawn;

      this.enemies = [
        new GameCtrl.Slime(this.game, this.player, this.pickups),
        new GameCtrl.Bat(this.game, this.player, this.pickups)
      ];

      for (var i = 0; i < this.enemies.length; i += 1) {
        this.enemies[i].create();
      }
  },

  update: function (tilesCollision) {

    for (var i = 0; i < this.enemies.length; i += 1) {
      this.enemies[i].update(this.player, tilesCollision, this.map, this.reverseTriggers);
    }
  }
};

}());
