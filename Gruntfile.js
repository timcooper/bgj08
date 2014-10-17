module.exports = function(grunt) {
	var path = require('path');

	grunt.option('httpdocs', path.join(process.cwd(), 'vhost/httpdocs/'));
	grunt.option('application', path.join(process.cwd(), 'vhost/private/application/'));

	require('load-grunt-config')(grunt, {
		configPath: path.join(process.cwd(), 'grunt/tasks')
	});
};