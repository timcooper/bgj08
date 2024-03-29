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

		this.load.image('title', '../assets/images/HELtitle.png');
		this.load.image('jarl', '../assets/images/jarlleap.png');

		this.load.spritesheet('ordericon', '../assets/images/ordericons.png', 16, 16);
		this.load.spritesheet('hpmeter', '../assets/images/hpmeter.png', 16, 16);
		this.load.spritesheet('hpend', '../assets/images/hpend.png', 32, 32);

		this.load.image('bgCave', '../assets/images/bgCave.png');

    this.load.image('swordsman', '../assets/swordsman.png');
    this.load.image('heroarm', '../assets/hero_arm.png');
    this.load.image('arrow', '../assets/images/arrow.png');
		this.load.image('seer', '../assets/images/seer.png');
    this.load.image('berserker', '../assets/images/berserker.png');
		this.load.spritesheet('boss', '../assets/images/boss.png', 32, 32);
		this.load.spritesheet('firebolt', '../assets/images/firebolt.png', 16, 16);
		this.load.spritesheet('skullnest1', '../assets/images/skullnest1.png', 32, 16);
		this.load.spritesheet('pickups', '../assets/images/pickups.png', 16, 16);
    this.load.tilemap('level1Map', '../assets/hel.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('cave', '../assets/cave.png');
		this.load.image('heltile', '../assets/images/heltile.png');
    this.load.spritesheet('player', '../assets/images/hero.png', 32, 32);
    this.load.spritesheet('slime', '../assets/images/slime.png', 16, 16);
		this.load.spritesheet('bat', '../assets/images/bat.png', 16, 16);

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {
		this.game.state.start('Title');
	}

};

})();
