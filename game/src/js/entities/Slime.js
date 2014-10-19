(function(){
'use strict';

GameCtrl.Slime = function(game, player){
  this.game = game;
  this.player = player;
};

GameCtrl.Slime.prototype = {
  spawn: function(x, y) {
    if (this.slimes.countDead() > 0)
    {
      var enemy = this.slimes.getFirstExists(false);

      if(enemy) {
        enemy.reset(x, y);
        this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.enableBody = true;
        enemy.enableBounce = true;
        enemy.body.bounce.y = 0.5;
        enemy.body.collideWorldBounds = true;
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 50;
      }
    }
  },

  create: function (amount) {
    amount = amount||30;

    this.slimes = game.add.group();

    this.slimes.enableBody = true;
    this.slimes.physicsBodyType = Phaser.Physics.ARCADE;

    this.slimes.createMultiple(amount, 'slime');
    this.slimes.setAll('anchor.x', 0.5);
    this.slimes.setAll('anchor.y', 0.5);

    this.slimes.enableBody = true;
    this.slimes.physicsBodyType = Phaser.Physics.ARCADE;

    this.slimes.callAll('animations.add', 'animations', 'bounce', null, 6, true);
    this.slimes.callAll('play', null, 'bounce');
  },

  update: function (tilesCollision) {
    //game.physics.arcade.overlap(animalsGroup, player, playerHitsAnimal, null, this);
    this.game.physics.arcade.collide(this.slimes, tilesCollision);

    this.slimes.forEachAlive(function(item) {
      if(item.body.blocked.right) item.body.velocity.x = -50;
      if(item.body.blocked.left) item.body.velocity.x = 50;

      //this.game.physics.moveToPointer(item, 1000);
      /*item.body.velocity.x = 100;
      // move in opposite direction when on screen bounds
      if ( (item.x < 0) || (item.x > 360) ) {item.body.velocity.x = -1 * 100;};*/
    }, this);
    //this.slimes.forEach(moveToObject, thigame.physics.arcade, this.player.sprite, 200);
  }
};

}());
