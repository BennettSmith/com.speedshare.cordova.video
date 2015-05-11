#!/usr/bin/env node

module.exports = function (context) {
  var downloadFile = require('./downloadFile.js'),
    exec = require('./exec/exec.js'),
    Q = context.requireCordovaModule('q'),
    deferral = new Q.defer();
  console.log('Downloading iOS VideoKit');
  downloadFile('https://s3-us-west-2.amazonaws.com/speedshare/VideoKit_2.3_lc.zip', './VideoKit_2.3_lc.zip', function (err) {
    if (!err) {
      console.log('downloaded');
      exec('unzip -P \'BUAQ!R8RHabK7XrGfUKH\' ./VideoKit_2.3_lc.zip', function (err, out, code) {
        console.log('expanded');
        var frameworkDir = context.opts.plugin.dir + '/src/ios/VideoKit';
        //var frameworkDir = './plugins/com.speedshare.cordova.video/src/ios/VideoKit';
        exec('mv ./VideoKit/VideoKit ' + frameworkDir, function (err, out, code) {
          console.log('moved VideoKit ' + frameworkDir);
          console.log('cleaning up');
          exec('rm ./VideoKit', function (err, out, code) {
            exec('rm ./VideoKit_2.3_lc.zip', function (err, out, code) {
              deferral.resolve();
            });
          });
        });
      });
    }
  });
  return deferral.promise;
};
