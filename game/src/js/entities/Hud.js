(function(){
'use strict';

GameCtrl.HUD = function(game, player){
  Phaser.Group.call(this, game);
  this.style = { font: '12px Arial', fill: '#ffffff', align: 'center'};

  this.healthDisplay = this.game.add.text(10, 10, "Health: 10", this.style);
  this.healthDisplay.fixedToCamera = true;

  this.orderDisplay = this.game.add.text(10, game.camera.height - 20, "Order: Swordsmen", this.style);
  this.orderDisplay.fixedToCamera = true;
};

GameCtrl.HUD.prototype = Object.create(Phaser.Group.prototype);
GameCtrl.HUD.prototype.constructor = GameCtrl.Hud;

GameCtrl.HUD.prototype.setHealth = function(health) {
  this.healthDisplay.destroy();

  this.healthDisplay = this.game.add.text(10, 10, "Health: "+health, this.style);
  this.healthDisplay.fixedToCamera = true;
}

GameCtrl.HUD.prototype.setOrder = function(troops) {
  this.orderDisplay.destroy();

  this.orderDisplay = this.game.add.text(10, game.camera.height - 20, "Order: "+troops, this.style);
  this.orderDisplay.fixedToCamera = true;
}

}());
