'use strict';

var GAME_WIDTH = 320;
var GAME_HEIGHT = 240;

/* global GameCtrl */
//        Create your Phaser game and inject it into the game div.
//        We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
//        We're using a game size of 1024 x 768 here, but you can use whatever you feel makes sense for your game of course.
var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, /*Phaser.AUTO*/ Phaser.CANVAS, 'game',false,false,false);

	//        Add the States your game has.
	//        You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
game.state.add('Boot', GameCtrl.Boot);
game.state.add('Preloader', GameCtrl.Preloader);
game.state.add('Title', GameCtrl.Title);
//game.state.add('MainMenu', GameCtrl.MainMenu);
game.state.add('Level1', GameCtrl.Level1);

	//        Now start the Boot state.
game.state.start('Boot');

document.onmousedown=function disableclick(event){
  if(event.button==2)
   {
     return false;
   }
}
