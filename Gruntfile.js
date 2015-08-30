module.exports = function (grunt) {

    grunt.initConfig({
        compress: {
            main: {
                options: {
                    archive: 'brackets-print-margin.zip'
                },
                files: [
                    {
                        src: [
                            'img/**',
                            'nls/**',
                            'styles/*',
                            'templates/*',
                            'CHANGELOG.md',
                            'LICENSE',
                            'main.js',
                            'package.json',
                            'README.md',
                            'strings.js'
                        ]
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['compress']);
};
