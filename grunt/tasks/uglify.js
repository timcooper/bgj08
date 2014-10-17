var grunt = require('grunt');

module.exports = {
	build: {
		files: {
			'game/build/js/game.js': ['game/src/js/vendor/phaser.js', 'game/src/js/main.js']
		}
	}
};
