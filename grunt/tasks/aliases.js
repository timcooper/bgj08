var grunt = require('grunt'),
	application = grunt.option('application');

module.exports = function() {
	return {
		"default": [
			"uglify",
			"cssmin"
		]
	}
};
