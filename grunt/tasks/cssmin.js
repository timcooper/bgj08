var grunt = require('grunt');

module.exports = {
	build: {
		files: {
			'game/build/css/styles.css': ['game/src/css/main.css', 'game/src/css/normalize.min.css']
		}
	}
};
