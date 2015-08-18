window.SSVideo = {
  left:0,
  top:0,
  height:525,
  width:375,
  scrolltop: 0,
  scrollleft: 0,
  localscrolltop: 0,
  localscrollleft: 0,
  canvasleft:0,
  canvastop:98,
  videoHeight:768,
  videoWidth:1028,
  scale:1,
  videoStarted: false,
  videoPlaying: false,
  viewer: false,
  startSession: function(cb) {
    SSVideo.videoStarted = true;
    SSVideo.videoPlaying = true;

    var top = (SSVideo.top) * SSVideo.scale + SSVideo.localscrolltop + SSVideo.canvastop;
    var left = (SSVideo.left) * SSVideo.scale + SSVideo.localscrollleft + SSVideo.canvasleft;
    var width = SSVideo.scale * SSVideo.videoWidth;
    var height = SSVideo.scale * SSVideo.videoHeight;

    if (cb) {
      Cordova.exec(cb, SSVideo.SSVideoError, 'SpeedsharePlugin', 'startSession', [SSVideo.path, top, left, width, height]);
    } else {
      Cordova.exec(SSVideo.SSVideoSuccess, SSVideo.SSVideoError, 'SpeedsharePlugin', 'startSession', [SSVideo.path, top, left, width, height]);      
    }
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
  },
  stopSession: function() {
    SSVideo.videoPlaying = false;

    Cordova.exec(SSVideo.SSVideoSuccess, SSVideo.SSVideoError, 'SpeedsharePlugin', 'stopSession', []);
    var ele = document.body;
    ele.className = ele.className.replace(/ transparent/g,'');
    ele.style.backgroundColor = '';
  },
  setViewer: function(v) {
    SSVideo.viewer = v;
  },
  pauseSession: function() {
    SSVideo.videoPlaying = false;

    Cordova.exec(SSVideo.SSVideoSuccess, SSVideo.SSVideoError, 'SpeedsharePlugin', 'stopSession', []);
  },
  playSession: function(cb) {
    SSVideo.videoPlaying = true;

    var top = (SSVideo.top) * SSVideo.scale + SSVideo.localscrolltop + SSVideo.canvastop;
    var left = (SSVideo.left) * SSVideo.scale + SSVideo.localscrollleft + SSVideo.canvasleft;
    var width = SSVideo.scale * SSVideo.videoWidth;
    var height = SSVideo.scale * SSVideo.videoHeight;

    if (cb) {
      Cordova.exec(cb, SSVideo.SSVideoError, 'SpeedsharePlugin', 'startSession', [SSVideo.path, top, left, width, height]);
    } else {
      Cordova.exec(SSVideo.SSVideoSuccess, SSVideo.SSVideoError, 'SpeedsharePlugin', 'startSession', [SSVideo.path, top, left, width, height]);      
    }
 },
  updateStream: function() {
    Cordova.exec(SSVideo.SSVideoSuccess, SSVideo.SSVideoError, 'SpeedsharePlugin', 'updateStream', []);
  },
  SSVideoSuccess: function(data) {
    console.log('SSVideoSuccess', data);
  },
  SSVideoError: function(data) {
    console.log('SSVideoError', data);
  },
  attachListeners: function(speedshare) {
    /*
    done in browserController so it can use ionicloading
    speedshare.on('remote#playVideo', function(type, data){
      if (window.SSVideo.videoStarted) {
        window.SSVideo.playSession();
      } else {
        window.SSVideo.startSession();
      }
    });
    */
    speedshare.on('remote#pauseVideo', function(type, data){
      if (window.SSVideo.videoStarted) {
        window.SSVideo.pauseSession();
      }
    });
    speedshare.on('canvas#resize', function(type, data){
      window.SSVideo.path = data.path;
      window.SSVideo.scale = data.scale;
      if (SSVideo.viewer) {
        window.SSVideo.startSession();
      }
    });
    speedshare.on('connect#stop', function(type, data){
      if (window.SSVideo.videoStarted) {
        window.SSVideo.stopSession();
      }
    });
  }
};