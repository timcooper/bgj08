(function(){
'use strict';

GameCtrl.Title = function () {

};

GameCtrl.Title.prototype = {

	create: function () {
    this.add.sprite(GAME_WIDTH /2 - 75, 10, 'title');
    this.add.sprite(GAME_WIDTH /2 - 83, GAME_HEIGHT - 162, 'jarl');
	},

	update: function () {
		if(game.input.activePointer.isDown)
			this.game.state.start('Level1');
	}

};

})();
