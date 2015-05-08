window.SSVideo = {
  originalWidth: 0,
  originalHeight: 0,
  streamWidth: 0,
  streamHeight: 0,
  startSession: function(path, top, left, width, height, streamWidth, streamHeight) {
    if (top === undefined) top = 192;
    if (left === undefined) left = 0;
    if (width === undefined) width = 320;
    if (height === undefined) height = 200;
    window.SSVideo.originalWidth = width;
    window.SSVideo.originalHeight = height;
    window.SSVideo.streamWidth = streamWidth;
    window.SSVideo.streamHeight = streamHeight;

    width = width * (window.SSVideo.streamWidth / window.SSVideo.originalWidth);
    height = height * (window.SSVideo.streamHeight / window.SSVideo.originalHeight);

    Cordova.exec(SSVideo.SSVideoSuccess, SSVideo.SSVideoError, 'SpeedsharePlugin', 'startSession', [path, top, left, width, height]);
    var ele = document.body;
    ele.className = ele.className.trim() + ' transparent';
    ele.style.backgroundColor = 'rgba(0,0,0,0)';

    setTimeout(function() {
      var div = document.createElement("div");
      div.className = 'modal-backdrop';
      div.setAttribute('id', 'shockRepaint');
      window.document.body.appendChild(div);
      setTimeout(function() {
        window.document.body.removeChild(div);
      }, 100);
    }, 2000);

    /*
    ele = document.getElementsByClassName('pane view-container')[0];
    ele.style.display='none';
    ele.offsetHeight; // no need to store this anywhere, the reference is enough
    ele.style.display='block';

    ele = document.body;
    ele.style.display='none';
    ele.offsetHeight; // no need to store this anywhere, the reference is enough
    ele.style.display='block';

    ele = document.body.parentElement;
    ele.style.display='none';
    ele.offsetHeight; // no need to store this anywhere, the reference is enough
    ele.style.display='block';
  */
    /*
    ele = document.body.getElementsByClassName('pane view-container')[0];
    ele.style.backgroundColor = 'rgba(255,255,255,1)';
    setTimeout(function() {
      ele.style.backgroundColor = 'rgba(0,0,0,0)';
    }, 3000);
    */
    /*
    document.body.parentElement.style.display = 'none';
    //var trick = document.body.parentElement.offsetHeight;
    setTimeout(function() {
      document.body.parentElement.style.display = 'block';
    }, 0);
*/
    //var event = new Event('resize');
    //window.dispatchEvent(event);
  },
  stopSession: function() {
    Cordova.exec(SSVideo.SSVideoSuccess, SSVideo.SSVideoError, 'SpeedsharePlugin', 'stopSession', []);
    var ele = document.body;
    ele.className = ele.className.replace(/ transparent/g,'');
    ele.style.backgroundColor = '';
  },
  updateView: function(top, left, width, height) {
    Cordova.exec(SSVideo.SSVideoSuccess, SSVideo.SSVideoError, 'SpeedsharePlugin', 'updateView', [top, left, width, height]);
  },
  updateStream: function() {
    Cordova.exec(SSVideo.SSVideoSuccess, SSVideo.SSVideoError, 'SpeedsharePlugin', 'updateStream', []);
  },
  SSVideoSuccess: function(data) {
    console.log('SSVideoSuccess', data);
  },
  SSVideoError: function(data) {
    console.log('SSVideoError', data);
  }
};