import { AfterViewInit,Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';





export declare var RTCMultiConnection:any;
export declare var getHTMLMediaElement:any;
export declare var FileSelector:any;
const RMCMediaTrack = {
    cameraStream: null,
    cameraTrack: null,
    screen: null,
    selfVideo:{srcObject:null}
}

@Component({
    selector:'meeting-page-compnent',
    templateUrl:'meeting-page.html',
    styleUrls:['meeting-page.css']
})
export class MeetingPageComponent implements AfterViewInit {
   connection = new RTCMultiConnection();
    // designer = new CanvasDesigner();
    open:string;
    _navigator = <any> navigator;
    chatText:string = '';
    password:string;
    progressHelper = {};
    userFullName:string;
    
    sessionId:string;
    publicRoomIdentifier:string;
    screenViewerDisplay:boolean = true;;
    btnChatMessageDisabled:boolean = true;
    btnShareScreenShow:boolean = true;
    typing:string;
    recentFile:any;
    screenViewerAny:any;
    tempStream:any;
    isScreenShare:boolean = true;
    @ViewChild('screenViewer') screenViewer: ElementRef; 
    @ViewChild('mainVideo') mainVideo: ElementRef; 
    @ViewChild('conversationPanel') conversationPanel: ElementRef;
    @ViewChild('txtChatMessage') txtChatMessage: ElementRef;
    @ViewChild('tempStreamCanvas') tempStreamCanvas;
    @ViewChild('otherVideos') otherVideos: ElementRef;
    mainVideoShow:boolean =true;
    
    keyPressTimer;
    numberOfKeys = 0;
    timer:number;
    giveTimer:number;
    interval;
    callDuration;
params:any;
    constructor(private route: ActivatedRoute,private renderer: Renderer2, private el: ElementRef) {
       
        console.log('Called Constructor');
        this.route.queryParams.subscribe(params => {
            // if(JSON. parse(localStorage.getItem("currentUser1"))){
            //     if(params['userFullName'] == JSON. parse(localStorage.getItem("currentUser1"))['username']
            //         ||params['userFullName'] == JSON. parse(localStorage.getItem("currentUser2"))['username']){
                        this.userFullName = params['userFullName'];
                        this.publicRoomIdentifier = params['publicRoomIdentifier'];
                        this.sessionId = params['sessionid'];
                        this.open = params['open'];
                        this.password = params['password'];
                        this.timer  = params['time'];
                    // }else{
                    //     var href = location.href+'/login';
                    //      window.open('http://localhost:4200/login?returnUrl=%2F','_self')
    
                    // }
            // }else{
            //     var href = location.href+'/login';
            //      window.open('http://localhost:4200/login?returnUrl=%2F','_self')

            // }
            
        });
    }
    ngAfterViewInit() {
        console.log(this.screenViewer);
  this.conversationPanel;
    this.screenViewerAny = this.screenViewer;
    console.log(this.screenViewerAny);
        this.connection.socketURL = 'https://localhost:9001/';
    //this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    
    this.connection.extra.userFullName = this.userFullName;
    this.callDuration = this.el.nativeElement.querySelector('#time');
    
    
    /// make this room public
    this.connection.publicRoomIdentifier = this.publicRoomIdentifier;
    
    this.connection.socketMessageEvent = 'canvas-dashboard-demo';
    
    // keep room opened even if owner leaves
    this.connection.autoCloseEntireSession = true;
    
    // https://www.rtcmulticonnection.org/docs/maxParticipantsAllowed/
    this.connection.maxParticipantsAllowed = 1000;

    // this.designer.widgetHtmlURL = '/node_modules/canvas-designer/widget.html';
    // this.designer.widgetJsURL = '/node_modules/canvas-designer/widget.min.js'

    // this.designer.addSyncListener(function(data) {
    //     this.connection.send(data);
    // });

    // this.designer.setSelected('pencil');
    
    // this.designer.setTools({
    //     pencil: true,
    //     text: true,
    //     image: true,
    //     pdf: true,
    //     eraser: true,
    //     line: true,
    //     arrow: true,
    //     dragSingle: true,
    //     dragMultiple: true,
    //     arc: true,
    //     rectangle: true,
    //     quadratic: false,
    //     bezier: true,
    //     marker: true,
    //     zoom: false,
    //     lineWidth: false,
    //     colorsPicker: false,
    //     extraOptions: false,
    //     code: false,
    //     undo: true
    // });

    this.connection.chunkSize = 16000;
    this.connection.enableFileSharing = true;
    
    this.connection.session = {
        audio: true,
        video: true,
        data: true
    };
    this.connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    };

    
    
    // https://www.rtcmulticonnection.org/docs/iceServers/
    // use your own TURN-server here!
    this.connection.iceServers = [{
        'urls': [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun.l.google.com:19302?transport=udp',
        ]
    }];
    
    
    this.connection.onUserStatusChanged =(event)=> {
        // var infoBar = document.getElementById('onUserStatusChanged');
        // var names = [];
        //this.connection.getAllParticipants().forEach(function(pid) {
        //     names.push(getFullName(pid));
        // });
    
        // if (!names.length) {
        //     names = ['Only You'];
        // } else {
        //     names = [connection.extra.userFullName || 'You'].concat(names);
        // }
    
        // infoBar.innerHTML = '<b>Active users:</b> ' + names.join(', ');
    };
    
    this.connection.onopen = (event)=> {
       this.connection.onUserStatusChanged(event);
    
        // if (this.designer.pointsLength <= 0) {
            // make sure that remote user gets all drawings synced.
            // setTimeout(() => {
                // this.connection.send('plz-sync-points');
            // }, 1000);
        // }
    
        this.btnChatMessageDisabled = false;
        // document.getElementById('btn-attach-file').style.display = 'inline-block';
        // document.getElementById('btn-share-screen').style.display = 'inline-block';
    };
    
    this.connection.onclose = this.connection.onerror = this.connection.onleave =(event)=> {
        this.connection.onUserStatusChanged(event);
    };
    
    this.connection.onmessage = (event) =>{
        if(event.data.showMainVideo) {
            // $('#main-video').show();
            // $('#screen-viewer').css({
            //     top: $('#widget-container').offset().top,
            //     left: $('#widget-container').offset().left,
            //     width: $('#widget-container').width(),
            //     height: $('#widget-container').height()
            // });
            this.screenViewerDisplay = true;
            return;
        }
    
        if(event.data.hideMainVideo) {
            // $('#main-video').hide();
            this.screenViewerDisplay = false;
            return;
        }
    
        if(event.data.typing === true) {
            this.typing = event.extra.userFullName + ' is typing';
            return;
        }
    
        if(event.data.typing === false) {
            this.typing = '';
            return;
        }
    
        if (event.data.chatMessage) {
            this.appendChatMessage(event);
            return;
        }
    
        if (event.data.checkmark === 'received') {
            var checkmarkElement = document.getElementById(event.data.checkmark_id);
            if (checkmarkElement) {
                checkmarkElement.style.display = 'inline';
            }
            return;
        }
    
        if (event.data === 'plz-sync-points') {
            // this.designer.sync();
            return;
        }
    
        // this.designer.syncData(event.data);
    };
    
    // extra code
    this.connection.videosContainer  = this.otherVideos.nativeElement;
    this.connection.mainVideoContainer  = this.mainVideo.nativeElement;
    this.connection.onstream = (event)=> {
        //this.startTimer(this.callDuration);
        var existing = document.getElementById(event.streamid);
    if(existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
        if(event.type === 'local' && event.stream.isVideo) {
            RMCMediaTrack.cameraStream = event.stream;
            RMCMediaTrack.cameraTrack = event.stream.getTracks(event.stream, 'video')[1];
          }

          
    event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    event.mediaElement.muted = true;
    event.mediaElement.volume = 0;
        if (event.stream.isScreen && !event.stream.canvasStream) {
            // this.screenViewer.nativeElement.get(0).srcObject = event.stream;
            // this.screenViewerDisplay = false;
        }
        else if (event.extra.roomOwner === true) {
            let video = this.renderer.createElement('video');
            try {
             video.nativeElement.setAttributeNode(this.renderer.setAttribute(this.el.nativeElement,'autoplay','true'));
             video.nativeElement.setAttributeNode(this.renderer.setAttribute(this.el.nativeElement,'playsinline','true'));
        } catch (e) {
            video.setAttribute('autoplay', true);
            video.setAttribute('playsinline', true);
            video.setAttribute('id', 'main-video');
            video.setAttribute('data-streamid', event.streamid);
            video.width="700"
        }
        if(this.open == 'true'){
            video.controls = true;
        }else{
            
                video.controls = false;
            
            
        }
        
            video.srcObject = event.stream;
            var width = 250;
        var mediaElement = getHTMLMediaElement(video, {
            title: event.extra.userFullName,
            buttons: ['full-screen'],
            width: width,
            showOnMouseEnter: false
        });
        
        this.connection.mainVideoContainer.appendChild(mediaElement);
        setTimeout(function() {
            
            // mediaElement.media.play();
        }, 5000);
        mediaElement.id = event.streamid;

    if(event.type === 'local') {
      RMCMediaTrack.selfVideo = mediaElement.media;
    }
            
        } else {
            let video = this.renderer.createElement('video');
    
            try {
             video.nativeElement.setAttributeNode(this.renderer.setAttribute(this.el.nativeElement,'autoplay','true'));
             video.nativeElement.setAttributeNode(this.renderer.setAttribute(this.el.nativeElement,'playsinline','true'));
        } catch (e) {
            video.setAttribute('autoplay', true);
            video.setAttribute('playsinline', true);
            video.setAttribute('id', event.streamid);
            video.setAttribute('class', 'other-video-element');
        }
        if(this.open == 'true'){
            video.controls = true;
        }else{
            if(event.extra.userFullName == this.userFullName){
                video.controls = true;
            }else{
                video.controls = false;
            }
        }

        
            video.srcObject = event.stream;
    
            var width = 250;
        var mediaElement = getHTMLMediaElement(video, {
            title: event.extra.userFullName,
            buttons: ['full-screen'],
            width: width,
            showOnMouseEnter: false
        });
        
        this.connection.videosContainer.appendChild(mediaElement);
        }
        this.connection.onUserStatusChanged(event);
    };
    
    this.connection.onstreamended = (event)=> {
        
        // var mediaElement = document.getElementById(event.streamid);
        // if (mediaElement) {
        //     mediaElement.parentNode.removeChild(mediaElement);
        // }
        
        //    var video = document.getElementById(event.streamid);
        //     if (video) {
        //         video.parentNode.removeChild(video);
        //         video.style.display='none';
        //         return;
        //     }

        var video = document.querySelector('video[data-streamid="' + event.streamid + '"]');
    if (!video) {
        video = document.getElementById(event.streamid);
        if (video) {
            video.parentElement.parentElement.remove();
            return;
        }
    }
    if (video) {
        // video.;
        video.parentElement.parentElement.remove();
    }
        
      
        
    };

    this.connection.onFileEnd = (file)=> {
        var html = this.getFileHTML(file);
        var div = this.progressHelper[file.uuid].div;
    
        if (file.userid === this.connection.userid) {
            div.innerHTML = '<b>You:</b><br>' + html;
            div.style.background = '#cbffcb';
    
            if(this.recentFile) {
                // this.recentFile.userIndex++;
                var nextUserId = '';
                // this.connection.getAllParticipants()[this.recentFile.userIndex];

                if(nextUserId) {
                    this.connection.send(this.recentFile, nextUserId);
                }
                else {
                    this.recentFile = null;
                }
            }
            else {
                this.recentFile = null;
            }
        } else {
            div.innerHTML = '<b>' + this.getFullName(file.userid) + ':</b><br>' + html;
        }
    };

    this.connection.autoSaveToDisk = false;

    // this.txtChatMessage.emojioneArea({
    //     pickerPosition: "top",
    //     filtersPosition: "bottom",
    //     tones: false,
    //     autocomplete: true,
    //     inline: true,
    //     hidePickerOnBlur: true,
    //     events: {
    //         focus: () => {
    //             // $('.emojionearea-category').unbind('click').bind('click', () => {
    //             //     $('.emojionearea-button-close').click();
    //             // });
    //         },
    //         keyup: function(e) {
    //             var chatMessage = $('.emojionearea-editor').html();
    //             if (!chatMessage || !chatMessage.replace(/ /g, '').length) {
    //                 this.connection.send({
    //                     typing: false
    //                 });
    //             }
    
    
    //             clearTimeout(this.keyPressTimer);
    //             this.numberOfKeys++;
    
    //             if (this.numberOfKeys % 3 === 0) {
    //                 this.connection.send({
    //                     typing: true
    //                 });
    //             }
    
    //             this.keyPressTimer = setTimeout(() => {
    //                 this.connection.send({
    //                     typing: false
    //                 });
    //             }, 1200);
    //         },
    //         blur: () => {
    //             // $('#btn-chat-message').click();
    //             this.connection.send({
    //                 typing: false
    //             });
    //         }
    //     }
    // });
    
        
    this.connection.onFileProgress = (chunk, uuid) =>{
        var helper = this.progressHelper[chunk.uuid];
        helper.progress.value = chunk.currentPosition || chunk.maxChunks || helper.progress.max;
        this.updateLabel(helper.progress, helper.label);
    };
    
    this.connection.onFileStart = (file) =>{
        var div = document.createElement('div');
        div.className = 'message';
    
        if (file.userid === this.connection.userid) {
            var userFullName = file.remoteUserId;
            if(this.connection.peersBackup[file.remoteUserId]) {
                userFullName = this.connection.peersBackup[file.remoteUserId].extra.userFullName;
            }
    
            div.innerHTML = '<b>You (to: ' + userFullName + '):</b><br><label>0%</label> <progress></progress>';
            div.style.background = '#cbffcb';
        } else {
            div.innerHTML = '<b>' + this.getFullName(file.userid) + ':</b><br><label>0%</label> <progress></progress>';
        }
    
        div.title = file.name;
        this.conversationPanel.nativeElement.appendChild(div);
        this.progressHelper[file.uuid] = {
            div: div,
            progress: div.querySelector('progress'),
            label: div.querySelector('label')
        };
       this.progressHelper[file.uuid].progress.max = file.maxChunks;
    
        this.conversationPanel.nativeElement.scrollTop = this.conversationPanel.nativeElement.clientHeight;
        this.conversationPanel.nativeElement.scrollTop = this.conversationPanel.nativeElement.scrollHeight - this.conversationPanel.nativeElement.scrollTop;
    };
    

    if(!!this.password) {
        this.connection.password = this.password;
    }
    
    // designer.appendTo(document.getElementById('widget-container'), () => {
        if (this.open === 'true' || this.open === 'true') {
                var tempStreamCanvas = this.tempStreamCanvas.nativeElement;
                this.tempStream = tempStreamCanvas.captureStream();
                this.tempStream.isScreen = true;
                this.tempStream.streamid = this.tempStream.id;
                this.tempStream.type = 'local';
                // this.connection.attachStreams.push(this.tempStream);
                // window.tempStream = tempStream;
    
                this.connection.extra.roomOwner = true;
                this.connection.open(this.sessionId, (isRoomOpened, roomid, error) =>{
                    if (error) {
                        if (error === this.connection.errors.ROOM_NOT_AVAILABLE) {
                            alert('Someone already created this room. Please either join or create a separate room.');
                            return;
                        }
                        alert(error);
                    }
    
                    this.connection.socket.on('disconnect', () => {
                        location.reload();
                    });
                });
        } else {
            this.connection.join(this.sessionId, (isRoomJoined, roomid, error) =>{
                if (error) {
                    if (error === this.connection.errors.ROOM_NOT_AVAILABLE) {
                        alert('This room does not exist. Please either create it or wait for moderator to enter in the room.');
                        return;
                    }
                    if (error === this.connection.errors.ROOM_FULL) {
                        alert('Room is full.');
                        return;
                    }
                    if (error === this.connection.errors.INVALID_PASSWORD) {
                        this.connection.password = prompt('Please enter room password.') || '';
                        if(!this.connection.password.length) {
                            alert('Invalid password.');
                            return;
                        }
                        this.connection.join(this.sessionId, (isRoomJoined, roomid, error) =>{
                            if(error) {
                                alert(error);
                            }
                        });
                        return;
                    }
                    alert(error);
                }
    
                this.connection.socket.on('disconnect', () => {
                    location.reload();
                });
            });
        }
    
    
 
    }

    
    
    
    
    // set value 2 for one-to-onethis.connection
    //this.connection.maxParticipantsAllowed = 2;
    
    // here goes canvas designer
    
    
    // you can place widget.html anywhere
    
    
    
    
    
    
    // here goes RTCMultiConnection
    
   
    appendChatMessage(event, checkmark_id?:string) {
        var div = this.renderer.createElement('div');
        
        div.className = 'message';
    
        if (event.data) {
            div.innerHTML = '<b>' + (event.extra.userFullName || event.userid) + ':</b><br>' + event.data.chatMessage;
    
            if (event.data.checkmark_id) {
                this.connection.send({
                    checkmark: 'received',
                    checkmark_id: event.data.checkmark_id
                });
            }
        } else {
            div.innerHTML = '<b>You:</b> <img style="display:none;width: 15px;vertical-align: middle;" class="checkmark" id="' + checkmark_id + '" title="Received" src="https://www.webrtc-experiment.com/images/checkmark.png"><br>' + event;
            div.style.background = '#cbffcb';
        }
    
        this.conversationPanel.nativeElement.appendChild(div);
    
        this.conversationPanel.nativeElement.scrollTop = this.conversationPanel.nativeElement.clientHeight;
        this.conversationPanel.nativeElement.scrollTop = this.conversationPanel.nativeElement.scrollHeight - this.conversationPanel.nativeElement.scrollTop;
    }
    
    
    // window.onkeyup = function(e) {
    //     var code = e.keyCode || e.which;
    //     if (code == 13) {
    //         $('#btn-chat-message').click();
    //     }
    // };
    
    sendMessage(event) {
        var chatMessage = this.chatText;
        this.chatText = '';;
        // $('.emojionearea-editor').html('');
    
        if (!chatMessage || !chatMessage.replace(/ /g, '').length) return;
    
        var checkmark_id = this.connection.userid + this.connection.token();
    
        this.appendChatMessage(chatMessage, checkmark_id);
    
        this.connection.send({
            chatMessage: chatMessage,
            checkmark_id: checkmark_id
        });
    
        this.connection.send({
            typing: false
        });
    };
    
    
    attachFile(event) {
        
        var file = new FileSelector();
        file.selectSingleFile((file)=> {
            this.recentFile = file;
    
            if(this.connection.getAllParticipants().length >= 1) {
                this.recentFile.userIndex = 0;
                this.connection.send(file, this.connection.getAllParticipants()[this.recentFile.userIndex]);
            }
        });
    };
    
    getFileHTML(file) {
        var url = file.url || URL.createObjectURL(file);
        var attachment = '<a href="' + url + '" target="_blank" download="' + file.name + '">Download: <b>' + file.name + '</b></a>';
        if (file.name.match(/\.jpg|\.png|\.jpeg|\.gif/gi)) {
            attachment += '<br><img crossOrigin="anonymous" src="' + url + '">';
        } else if (file.name.match(/\.wav|\.mp3/gi)) {
            attachment += '<br><audio src="' + url + '" controls></audio>';
        } else if (file.name.match(/\.pdf|\.js|\.txt|\.sh/gi)) {
            attachment += '<iframe class="inline-iframe" src="' + url + '"></iframe></a>';
        }
        return attachment;
    }
    
    getFullName(userid) {
        var _userFullName = userid;
        if (this.connection.peers[userid] && this.connection.peers[userid].extra.userFullName) {
            _userFullName = this.connection.peers[userid].extra.userFullName;
        }
        return _userFullName;
    }
    
    
    
    // to make sure file-saver dialog is not invoked.
    
    
    

    updateLabel(progress, label) {
        if (progress.position == -1) return;
        var position = +progress.position.toFixed(2).split('.')[1] || 100;
        label.innerHTML = position + '%';
    }
    
    
    // });
    
    addStreamStopListener(stream, callback) {
        stream.addEventListener('ended', ()=> {
            callback();
            callback = () => {};
        }, false);
    
        stream.addEventListener('inactive', () => {
            callback();
            callback = () => {};
        }, false);
    
        stream.getTracks().forEach((track)=> {
            track.addEventListener('ended', () => {
                callback();
                callback = () => {};
            }, false);
    
            track.addEventListener('inactive', () => {
                callback();
                callback = () => {};
            }, false);
        });
    }
    
    replaceTrack( videoTrack, screenTrackId?:any,stream?:MediaStream,) {
        if (!videoTrack) return;
        if (videoTrack.readyState === 'ended') {
            alert('Can not replace an "ended" track. track.readyState: ' + videoTrack.readyState);
            return;
        }
        this.connection.getAllParticipants().forEach((pid)=> {
            var peer = this.connection.peers[pid].peer;
            if (!peer.getSenders) return;
            var trackToReplace = videoTrack;
            peer.getSenders().forEach((sender)=> {
                if (!sender || !sender.track) return;
                if(screenTrackId) {
                    if(trackToReplace && sender.track.id === screenTrackId) {
                        sender.replaceTrack(trackToReplace);
                        trackToReplace = null;
                     }
                    return;
                }
    
                if(sender.track.id !== this.tempStream.getTracks()[0].id) return;
                if (sender.track.kind === 'video' && trackToReplace) {
                    sender.replaceTrack(trackToReplace);
                    
                    trackToReplace = null;
                    // this.onSucces(stream);
                }
            });
        });
    }
    
    replaceScreenTrack(stream) {
        stream.isScreen = true;
        stream.streamid = stream.id;
        stream.type = 'local';
    
        //this.connection.attachStreams.push(stream);
        this.connection.onstream({
            stream: stream,
            type: 'local',
            streamid: stream.id,
            // mediaElement: video
        });
    
        var screenTrackId = stream.getTracks()[0].id;
        this.addStreamStopListener(stream, () => {
            this.connection.send({
                hideMainVideo: true
            });
    
            // $('#main-video').hide();
            this.screenViewerDisplay = false;
            //$('#btn-share-screen').show();
            this.replaceTrack(this.tempStream.getTracks()[0], screenTrackId);
        });
    
        this.onSucces(stream);    
        this.connection.send({
            showMainVideo: true
        });
    
        this.mainVideoShow = true;
        // $('#screen-viewer').css({
        //         top: $('#widget-container').offset().top,
        //         left: $('#widget-container').offset().left,
        //         width: $('#widget-container').width(),
        //         height: $('#widget-container').height()
        //     });
            this.screenViewerDisplay = true;
    }
    onSucces(stream: MediaStream): void{

        var video = this.mainVideo.nativeElement;
    
        video.srcObject = stream;   
    
        video.onloadedmetadata = function(e) {
    
          video.play();
    
        };
    
      }

      onError(error: Error):void {

        console.log('Error message: ' + error.message);
    
        console.log('Error name: ' + error.name);
    
      }
    

    screenShare(event){
        this.getScreenShareStream((screen) =>{
            var isLiveSession = this.connection.getAllParticipants().length > 0;
            if (isLiveSession) {
                this.replaceScreenShareTrack(RMCMediaTrack.screen);
            }
    
            // now remove old video track from "attachStreams" array
            // so that newcomers can see screen as well
            this.connection.attachStreams.forEach((stream)=> {
                stream.getTracks(stream, 'video').forEach((track) =>{
                    // stream.removeTrack(track);
                });
    
                // now add screen track into that stream object
                stream.addTrack(RMCMediaTrack.screen);
            });
        });
    }

    replaceScreenShareTrack(videoTrack) {
        if (!videoTrack) return;
        if (videoTrack.readyState === 'ended') {
            alert('Can not replace an "ended" track. track.readyState: ' + videoTrack.readyState);
            return;
        }
        this.connection.getAllParticipants().forEach((pid) => {
            var peer = this.connection.peers[pid].peer;
            if (!peer.getSenders) return;
    
            var trackToReplace = videoTrack;
    
            peer.getSenders().forEach((sender) =>{
                if (!sender || !sender.track) return;
    
                if (sender.track.kind === 'video' && trackToReplace) {
                    sender.replaceTrack(trackToReplace);
                    trackToReplace = null;
                }
            });
        });
    }

    screenHelper(callback) {
        if(this._navigator.mediaDevices.getDisplayMedia) {
              this._navigator.mediaDevices.getDisplayMedia({video:true}).then(stream => {
                  callback(stream);
              }, error => {
                  alert('Please make sure to use Edge 17 or higher.');
              });
          }
          else if(this._navigator.getDisplayMedia) {
              this._navigator.getDisplayMedia({video:true}).then(stream => {
                  callback(stream);
              }, error => {
                  alert('Please make sure to use Edge 17 or higher.');
              });
          }
          else {
              alert('getDisplayMedia API is not available in this browser.');
          }
      }
      
      startTimer(display) {
        var timer = this.timer;
        var minutes;
        var seconds;

        this.interval = setInterval(() => {
            minutes = Math.floor(timer / 60);
            seconds = Math.floor(timer % 60);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            --timer;
            if (--timer < 0) {
                 console.log('timeup');
                 clearInterval(this.interval)
            }
        },1000)
      }
    getScreenShareStream(callback) {
        this.isScreenShare = false;
        this.screenHelper((screen) =>{
              RMCMediaTrack.screen = screen.getTracks(screen, 'video')[0];
  
              RMCMediaTrack.selfVideo.srcObject = screen;
  
              // in case if onedned event does not fire
              (function looper() {
                  // readyState can be "live" or "ended"
                  if (RMCMediaTrack.screen.readyState === 'ended') {
                      RMCMediaTrack.screen.onended();
                      return;
                  }
                  setTimeout(looper, 1000);
              })();
  
              var firedOnce = false;
              RMCMediaTrack.screen.onended = RMCMediaTrack.screen.onmute = RMCMediaTrack.screen.oninactive = ()=> {
                  if (firedOnce) return;
                  firedOnce = true;
  
                  if (screen.getTracks(RMCMediaTrack.cameraStream, 'video')[0].readyState) {
                      screen.getTracks(RMCMediaTrack.cameraStream, 'video').forEach((track)=> {
                          RMCMediaTrack.cameraStream.removeTrack(track);
                      });
                      RMCMediaTrack.cameraStream.addTrack(RMCMediaTrack.cameraTrack);
                  }
  
                  RMCMediaTrack.selfVideo.srcObject = RMCMediaTrack.cameraStream;
  
                 this.connection.socket &&this.connection.socket.emit(this.connection.socketCustomEvent, {
                      justStoppedMyScreen: true,
                      userid:this.connection.userid
                  });
  
                  // share camera again
                  this.replaceScreenShareTrack(RMCMediaTrack.cameraTrack);
  
                  // now remove old screen from "attachStreams" array
                 this.connection.attachStreams = [RMCMediaTrack.cameraStream];
  
                  // so that user can share again
                //   btnShareScreen.disabled = false;
              };
  
             this.connection.socket &&this.connection.socket.emit(this.connection.socketCustomEvent, {
                  justSharedMyScreen: true,
                  userid:this.connection.userid
              });
  
              callback(screen);
          });
  }
    
    

}