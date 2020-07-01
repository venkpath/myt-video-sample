import { Component, OnInit } from '@angular/core';

export declare var MediaRecorder:any;
@Component({
    selector:'screen-record',
    templateUrl:'screen-record.html',
    styleUrls:['screen-record.css']
})
export class ScreenRecord implements OnInit{
    mediaRecorder;
recordedBlobs;
stream;
mainVideo;
blob;


 ngOnInit(){
    
 }

 handleSuccess(stream) {
    // recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    this.stream = stream;
  
    this.mainVideo = document.querySelector('video#main-video');
    this.mainVideo.srcObject = stream;
  }

 async screenRecord(event){
    try {
        const stream = await  navigator.mediaDevices.getUserMedia({video:true,audio:true});
        this.handleSuccess(stream);
      } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        // errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
      }
console.log('screen record');

  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
 this.mediaRecorder = new MediaRecorder(this.stream,options);
 this.mediaRecorder.blob = [];
//   if (!mediaRecorder.isTypeSupported(options.mimeType)) {
//     console.error(`${options.mimeType} is not supported`);
//     options = {mimeType: 'video/webm;codecs=vp8,opus'};
//     if (!mediaRecorder.isTypeSupported(options.mimeType)) {
//       console.error(`${options.mimeType} is not supported`);
//       options = {mimeType: 'video/webm'};
//       if (!mediaRecorder.isTypeSupported(options.mimeType)) {
//         console.error(`${options.mimeType} is not supported`);
//         options = {mimeType: ''};
//       }
//     }
// }

this.mediaRecorder.onstop = (event) => {
  console.log('Recorder stopped: ', event);
  console.log('Recorded Blobs: ', this.mediaRecorder.blob);
};
this.mediaRecorder.ondataavailable = this.handleDataAvailable;
this.mediaRecorder.start();
}

handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      this.blob.push(event.data);
    }
  }

 
 downloadRecord(event){
    console.log('download screen record');
    const blob = new Blob(this.mediaRecorder.blob
        , {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

stopRecord(event){
    console.log('stop screen record');
    this.mediaRecorder.stop();
}
}