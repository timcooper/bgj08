(function(){
'use strict';

GameCtrl.Enemies = function(game, player, map){
  this.game = game;
  this.player = player;
  this.map = map;

  this.spawnRate = 1000;
  this.nextSpawn = 100;

  this.totalEnemies = 200;
  this.currentEnemies = 0;

  this.canSpawn = true;
};

GameCtrl.Enemies.prototype = {
  spawn: function(player) {
    if(this.canSpawn) {
      if (this.game.time.now > this.nextSpawn && this.currentEnemies <= this.totalEnemies)
      {
          this.nextSpawn = this.game.time.now + this.spawnRate;

          //var spawnBox = new Phaser.Rectangle(player.x, player.y, 200, 200);

          for (var i = 0; i < this.spawnPoints.length; i += 1) {
            //if(spawnBox.contains(this.spawnPoints[i].x, this.spawnPoints[i].y)) {
              for (var j = 0; j < this.enemies.length; j += 1) {
                this.enemies[j].spawn(this.spawnPoints[i].x, this.spawnPoints[i].y, 5);
                this.currentEnemies+5;
              }
            //}
          }

          /*for (var i = 0; i < this.enemies.length; i += 1) {
            this.enemies[i].spawn(player.x, player.y);
          }*/
      }
    }
  },

  create: function () {
      this.spawnPoints = this.map.objects.enemySpawn;

      this.enemies = [
        new GameCtrl.Slime(this.game, this.player)
      ];

      for (var i = 0; i < this.enemies.length; i += 1) {
        this.enemies[i].create();
      }
  },

  update: function (tilesCollision) {
    for (var i = 0; i < this.enemies.length; i += 1) {
      this.enemies[i].update(tilesCollision);
    }
  }
};

}());