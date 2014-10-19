(function(){
'use strict';

GameCtrl.HUD = function(game, player){
  Phaser.Group.call(this, game);
  this.fixedToCamera = true;
  this.style = { font: '12px Arial', fill: '#ffffff', align: 'center'};

  this.healthDisplay = this.game.add.text(10, 10, "Health: 10", this.style);
  this.healthDisplay.fixedToCamera = true;

  //this.orderDisplay = this.game.add.text(10, game.camera.height - 20, "Order: Swordsmen", this.style);
  //this.orderDisplay.fixedToCamera = true;

  this.orderDisplay = this.game.add.group();
  this.orderDisplay.fixedToCamera = true;

        //enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'baddie');
  this.swordsmenDisplay = this.create(10, game.camera.height - 20, 'ordericon', 5);
  this.archerDisplay = this.create(26, game.camera.height - 20, 'ordericon', 0);
  this.seerDisplay = this.create(42, game.camera.height - 20, 'ordericon', 3);
  this.berserkerDisplay = this.create(58, game.camera.height - 20, 'ordericon', 2);
};

GameCtrl.HUD.prototype = Object.create(Phaser.Group.prototype);
GameCtrl.HUD.prototype.constructor = GameCtrl.Hud;

GameCtrl.HUD.prototype.setHealth = function(health) {
  this.healthDisplay.destroy();

  this.healthDisplay = this.game.add.text(10, 10, "Health: "+health, this.style);
  this.healthDisplay.fixedToCamera = true;
}

GameCtrl.HUD.prototype.setOrder = function(troops) {
  this.swordsmenDisplay.frame = 1;
  this.archerDisplay.frame = 0;
  this.seerDisplay.frame = 3;
  this.berserkerDisplay.frame = 2;

  switch(troops) {
    case 'Swordsmen':
      this.swordsmenDisplay.frame = 5;
      break;
    case 'Archers':
      this.archerDisplay.frame = 4;
      break;
    case 'Seers':
      this.seerDisplay.frame = 7;
      break;
    case 'Berserkers':
      this.berserkerDisplay.frame = 6;
      break;
  }
}

}());
