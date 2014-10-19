(function(){
'use strict';

GameCtrl.Preloader = function () {
	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

GameCtrl.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(this.game.width / 2 - 48, this.game.height / 2 - 16, 'preloaderBackground');
		this.preloadBar = this.add.sprite(this.game.width / 2 - 48, this.game.height / 2 - 16, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

    this.load.image('swordsman', '../assets/swordsman.png');
    this.load.image('heroarm', '../assets/hero_arm.png');
    this.load.image('arrow', '../assets/images/arrow.png');
		this.load.image('seer', '../assets/images/seer.png');
    this.load.image('berserker', '../assets/images/berserker.png');
    this.load.tilemap('level1Map', '../assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('cave', '../assets/cave.png');
    this.load.spritesheet('player', '../assets/walksheet.png', 32, 32);
    this.load.spritesheet('slime', '../assets/images/slime.png', 16, 16);

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {
		this.game.state.start('Level1');
	}

};

})();
