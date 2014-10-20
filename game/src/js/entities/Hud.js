(function(){
'use strict';

GameCtrl.HUD = function(game, player){
  Phaser.Group.call(this, game);
  this.fixedToCamera = true;
  this.style = { font: '12px Arial', fill: '#ffffff', align: 'center'};

  //this.healthDisplay = this.game.add.text(10, 10, "Health: 10", this.style);
  //this.healthDisplay.fixedToCamera = true;

  //this.orderDisplay = this.game.add.text(10, game.camera.height - 20, "Order: Swordsmen", this.style);
  //this.orderDisplay.fixedToCamera = true;

  this.healthDisplay = this.game.add.group();
  this.healthDisplay.fixedToCamera = true;

  this.hpend = this.create(0, 0, 'hpend', 0);
  var blocks = this.healthDisplay.createMultiple(4, 'hpmeter', 1, true);
  var i = 1;
  this.healthDisplay.forEach(function(item) {
    item.x = 8;
    item.y = 16 + (i * 16);
    i++;
  });
  this.hptail = this.create(8, 16 + (i * 16), 'hpmeter', 3);

  this.orderDisplay = this.game.add.group();
  this.orderDisplay.fixedToCamera = true;

  this.swordsmenDisplay = this.create(10, game.camera.height - 20, 'ordericon', 5);
  this.archerDisplay = this.create(26, game.camera.height - 20, 'ordericon', 0);
  this.seerDisplay = this.create(42, game.camera.height - 20, 'ordericon', 3);
  this.berserkerDisplay = this.create(58, game.camera.height - 20, 'ordericon', 2);
};

GameCtrl.HUD.prototype = Object.create(Phaser.Group.prototype);
GameCtrl.HUD.prototype.constructor = GameCtrl.Hud;

GameCtrl.HUD.prototype.setHealth = function(health) {
  var normHealth = Math.floor(health);
  if(normHealth == 0.5) normHealth = 1;
  switch(normHealth) {
    case 10:
      this.hpend.frame = 0;
      this.healthDisplay.forEach(function(item) {
        item.frame = 1;
      });
      this.hptail.frame = 3;
      break;
    case 9:
      this.hpend.frame = 0;
      this.healthDisplay.forEach(function(item) {
        item.frame = 1;
      });
      this.hptail.frame = 4;
      break;
    case 8:
      this.hpend.frame = 0;
      this.healthDisplay.getAt(3).frame = 0;
      this.healthDisplay.getAt(2).frame = 1;
      this.healthDisplay.getAt(1).frame = 1;
      this.healthDisplay.getAt(0).frame = 1;
      this.hptail.frame = 4;
      break;
    case 7:
      this.hpend.frame = 0;
      this.healthDisplay.getAt(3).frame = 2;
      this.healthDisplay.getAt(2).frame = 1;
      this.healthDisplay.getAt(1).frame = 1;
      this.healthDisplay.getAt(0).frame = 1;
      this.hptail.frame = 4;
      break;
    case 6:
      this.hpend.frame = 0;
      this.healthDisplay.getAt(3).frame = 2;
      this.healthDisplay.getAt(2).frame = 0;
      this.healthDisplay.getAt(1).frame = 1;
      this.healthDisplay.getAt(0).frame = 1;
      this.hptail.frame = 4;
      break;
    case 5:
      this.hpend.frame = 0;
      this.healthDisplay.getAt(3).frame = 2;
      this.healthDisplay.getAt(2).frame = 2;
      this.healthDisplay.getAt(1).frame = 1;
      this.healthDisplay.getAt(0).frame = 1;
      this.hptail.frame = 4;
      break;
    case 4:
      this.hpend.frame = 0;
      this.healthDisplay.getAt(3).frame = 2;
      this.healthDisplay.getAt(2).frame = 2;
      this.healthDisplay.getAt(1).frame = 0;
      this.healthDisplay.getAt(0).frame = 1;
      this.hptail.frame = 4;
      break;
    case 3:
      this.hpend.frame = 0;
      this.healthDisplay.getAt(3).frame = 2;
      this.healthDisplay.getAt(2).frame = 2;
      this.healthDisplay.getAt(1).frame = 2;
      this.healthDisplay.getAt(0).frame = 1;
      this.hptail.frame = 4;
      break;
    case 2:
      this.hpend.frame = 0;
      this.healthDisplay.getAt(3).frame = 2;
      this.healthDisplay.getAt(2).frame = 2;
      this.healthDisplay.getAt(1).frame = 2;
      this.healthDisplay.getAt(0).frame = 0;
      this.hptail.frame = 4;
      break;
    case 1:
      this.hpend.frame = 0;
      this.healthDisplay.getAt(3).frame = 2;
      this.healthDisplay.getAt(2).frame = 2;
      this.healthDisplay.getAt(1).frame = 2;
      this.healthDisplay.getAt(0).frame = 2;
      this.hptail.frame = 4;
      break;
    case 0:
      this.hpend.frame = 1;
      this.healthDisplay.getAt(3).frame = 2;
      this.healthDisplay.getAt(2).frame = 2;
      this.healthDisplay.getAt(1).frame = 2;
      this.healthDisplay.getAt(0).frame = 2;
      this.hptail.frame = 4;
      break;

  }
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
