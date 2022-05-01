const mediaStreamContrains = {
    video: {    // 也可以直接设置 true
        frameRate: {min: 20},           // 最小视频帧率
        width: {min: 640, ideal: 1280}, // ideal：理想宽度
        height: {min: 360, ideal: 720},
        aspectRatio: 16/9
    },
    audio: {    // true
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    }
};

function gotLocalMediaStream(mediaStream){
    localVideo.srcObject = mediaStream;
}

navigator.mediaDevices.getUserMedia(mediaStreamContrains).then(gotLocalMediaStream)
