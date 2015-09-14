#!/usr/bin/env node

module.exports = function (context) {
  var downloadFile = require('./downloadFile.js'),
    exec = require('./exec/exec.js'),
    Q = context.requireCordovaModule('q'),
    deferral = new Q.defer();
  console.log('Downloading iOS VideoKit');
  downloadFile('https://s3-us-west-2.amazonaws.com/speedshare/VideoKit.zip', './VideoKit.zip', function (err) {
    if (!err) {
      console.log('downloaded');
      exec('unzip ./VideoKit.zip', function (err, out, code) {
        console.log('expanded');
        var frameworkDir = context.opts.plugin.dir + '/src/ios/';
        exec('mv ./VideoKit/VideoKit ' + frameworkDir + 'VideoKit', function (err, out, code) {
          console.log('moved VideoKit ' + frameworkDir + 'VideoKit');
          console.log('cleaning up');
          exec('rm -f -r ./VideoKit', function (err, out, code) {
            exec('rm ./VideoKit.zip', function (err, out, code) {
              deferral.resolve();
            });
          });
        });
      });
    }
  });
  return deferral.promise;
};
