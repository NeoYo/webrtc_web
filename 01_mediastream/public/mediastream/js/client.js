'use strict'

var videoplay = document.querySelector('video#player');

function gotMediaStream(stream){

    var videoTrack = stream.getVideoTracks()[0];

    window.stream = stream;
    videoplay.srcObject = stream;
}

function handleError(err){
    console.log('getUserMedia error:', err);
}

function start() {

    if(!navigator.mediaDevices ||
       !navigator.mediaDevices.getUserMedia){
        // 注意：只有 localhost 和 https 才不为空
        console.log('getUserMedia is not supported!');
        return;

    }else{

        var constraints = {
            video : {
                width: 640,	
                height: 480,
                frameRate:15,
                facingMode: 'enviroment'
		//,
                //deviceId : deviceId ? {exact:deviceId} : undefined 
            }, 
            audio : false 
        }

        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotMediaStream)
            .catch(handleError);
    }
}

start();
