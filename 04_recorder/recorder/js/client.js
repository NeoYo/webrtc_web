'use strict'

var videoplay = document.querySelector('video#player');
//var audioplay = document.querySelector('audio#audioplayer');

//record
var recvideo = document.querySelector('video#recplayer');
var btnRecord = document.querySelector('button#record');
var btnPlay = document.querySelector('button#recplay');
var btnDownload = document.querySelector('button#download');

var buffer;
var mediaRecorder;

// 03 gotMediaStream
function gotMediaStream(stream){

	window.stream = stream;
	videoplay.srcObject = stream;

}

function handleError(err){
	console.log('getUserMedia error:', err);
}

function start() {

	if(!navigator.mediaDevices ||
		!navigator.mediaDevices.getUserMedia){

		console.log('getUserMedia is not supported!');
		return;

	}else{

		var constraints = {
			video : {
				width: 640,	
				height: 480,
				frameRate:15
			}, 
			audio : false 
		}
		// 02 navigator.mediaDevices.getUserMedia
		navigator.mediaDevices.getUserMedia(constraints)
			.then(gotMediaStream)
			.catch(handleError);
	}
}
// 01 start
start();

// 06 new MediaRecorder handleDataAvailable buffer.push
function handleDataAvailable(e){
	if(e && e.data && e.data.size > 0){
	 	buffer.push(e.data);			
	}
}

function startRecord(){
	
	buffer = []; // 每次点击 start 时，重置 buffer

	var options = {
		mimeType: 'video/webm;codecs=vp8'
	}

	if(!MediaRecorder.isTypeSupported(options.mimeType)){
		console.error(`${options.mimeType} is not supported!`);
		return;	
	}
	// 05 new MediaRecorder
	try{
		mediaRecorder = new MediaRecorder(window.stream, options);
	}catch(e){
		console.error('Failed to create MediaRecorder:', e);
		return;	
	}

	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.start(10);	// timeslice，时间切片，方便读写

}

function stopRecord(){
	mediaRecorder.stop();
}

btnRecord.onclick = ()=>{
	// 04 btnRecord.onclick startRecord
	if(btnRecord.textContent === 'Start Record'){
		startRecord();	
		btnRecord.textContent = 'Stop Record';
		btnPlay.disabled = true;
		btnDownload.disabled = true;
	}else{
	
		stopRecord();
		btnRecord.textContent = 'Start Record';
		btnPlay.disabled = false;
		btnDownload.disabled = false;

	}
}

btnPlay.onclick = ()=> {
	// 07 new Blob(buffer)
	var blob = new Blob(buffer, {type: 'video/webm'});
	recvideo.src = window.URL.createObjectURL(blob);
	recvideo.srcObject = null;
	recvideo.controls = true;
	recvideo.play();
}

btnDownload.onclick = ()=> {
	// 08 new Blob(buffer)
	var blob = new Blob(buffer, {type: 'video/webm'});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement('a');

	a.href = url;
	a.style.display = 'none';
	a.download = 'aaa.webm';
	a.click();
}

