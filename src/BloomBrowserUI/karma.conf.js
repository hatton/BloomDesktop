/* note: when you run karma, you'll get a failure for every <script> and <link> in the html, because
those start with "/bloom". While the Bloom server strips those off, karma doesn't. Seems like
Karma's "proxies" argument should be able to do that, but I haven't been successful.

Meanwhile, this file specifies every needed file, so that the tests still pass. 
*/

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '.',

        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/jquery/dist/jquery.js',
            'lib/jquery-ui/jquery-ui.min.js',
            'lib/jquery.myimgscale.js',
            'lib/jquery.qtip.js',
            'lib/jquery.qtipSecondary.js',
            'bookEdit/js/interIframeChannel.js',
            'bookEdit/js/getIframeChannel.js',
            'bookEdit/test/interIframeChannelInitializer.js',
            'lib/localizationManager/localizationManager.js',
            'lib/jquery.i18n.custom.js',
            'lib/split-pane/split-pane.js',
            'lib/long-press/jquery.mousewheel.js',
            'lib/long-press/jquery.longpress.js',

            // helpers -- jasmine-query
            'test/lib/**/*.js',

            // fixtures
            { pattern: 'test/fixtures/**/*.htm', included: false, served: true },
            //enhance: if we just say *.js, we get lots of errors as various library js files are all dumped in.
            //But this way here, of specifying each one we're actually testing, is obviously flawed too.
            //One idea would be to have TypeScript compiler name files such that we auto-include all the typescript-created js files,
            //under the assumption that anything we want to test will be written with typescript (at least eventually)
            '**/js/bloomBootstrap.js',
            '**/js/bloomEditing.js',
            '**/StyleEditor/StyleEditor.js',
            '**/OverflowChecker/OverflowChecker.js',
            '**/sourceBubbles/bloomSourceBubbles.js',
            '**/talkingBook/audioRecording.js',
            // as long as the test filename is in the test/specs folder, it will be included in the test run
            'test/specs/**/*.js',

            'lib/**/*Spec.js',

            // synphony files
            'bookEdit/toolbox/decodableReader/libsynphony/underscore_min_152.js',
            'bookEdit/toolbox/decodableReader/libsynphony/xregexp-all-min.js',
            'bookEdit/toolbox/decodableReader/libsynphony/synphony_lib.js',
            'bookEdit/toolbox/decodableReader/libsynphony/bloom_xregexp_categories.js',
            'bookEdit/toolbox/decodableReader/libsynphony/bloom_lib.js',
            'bookEdit/toolbox/decodableReader/libsynphony/jquery.text-markup.js',
            'bookEdit/toolbox/decodableReader/synphonyApi.js',
            'bookEdit/toolbox/decodableReader/readerToolsModel.js',
            'bookEdit/toolbox/decodableReader/readerTools.js',
            'bookEdit/js/*.js',
            'bookEdit/toolbox/toolbox.js',
            'bookEdit/test/*.js',
            'bookEdit/test/libsynphony/*.test.js',
            'bookEdit/toolbox/decodableReader/readerSettings.js',
            'bookEdit/toolbox/decodableReader/jquery.div-columns.js'
        ],
        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome IF YOU USE CHROME, NOTE THAT IF YOU MINIMIZE CHROME, IT WILL RUN TESTS SUPER SLOWLY
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Firefox'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
