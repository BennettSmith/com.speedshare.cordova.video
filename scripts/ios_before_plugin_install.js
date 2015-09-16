#!/usr/bin/env node

module.exports = function (context) {
  var urllib = require('urllib-sync'),
      fs = require('fs'),
      videoKitURL = 'https://s3-us-west-2.amazonaws.com/speedshare/VideoKit.zip',
      destDir = context.opts.plugin.dir + '/src/ios/';

  console.log('Downloading iOS VideoKit');
  console.log('  URL = ' + videoKitURL);

  var response = urllib.request(videoKitURL, { writeFile: destDir + 'VideoKit.zip' });
  if (response.status = 200) {
    console.log('Downloaded!');
  }
  else {
    console.log('Failed to download. Status = ' + response.status);
  }
  // fs.unlink(destDir+'VideoKit.zip', function(err) {
  // });
};
