#!/usr/bin/env node

module.exports = function (context) {
  var downloadFile = require('./downloadFile.js'),
    extract = require('extract-zip'),
    videoKitURL = 'https://s3-us-west-2.amazonaws.com/speedshare/VideoKit.zip',
    destDir = context.opts.plugin.dir + '/src/ios/';

  console.log('Downloading iOS VideoKit');
  console.log('  URL = ' + videoKitURL);

  downloadFile(videoKitURL, destDir + 'VideoKit.zip', function (err) {
    if (!err) {
      console.log('Downloaded!');
      extract(destDir+'VideoKit.zip', {dir: destDir}, function(err) {
      });
    }
  });
};
