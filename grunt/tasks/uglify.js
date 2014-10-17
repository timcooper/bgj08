var grunt = require('grunt'),
	httpdocs  = grunt.option('httpdocs');

module.exports = {
	build: {
		files: {
			'game/build/js/game.js': ['game/src/js/vendor/phaser.js', 'game/src/js/main.js']
		}
	}
};
