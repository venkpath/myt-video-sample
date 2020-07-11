import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertModal } from '../../components/alert-modal/alert-modal';
import { ActivatedRoute } from '@angular/router';
import { EncrDecrService } from '../../services/encode';
import { UrlService } from '../../services/url.service';
import { Subscription } from 'rxjs';

export declare var RTCMultiConnection:any;

@Component({
    selector:'main-page',
    templateUrl:'main-page.html',
    styleUrls:['main-page.css']
})
export class MainPage implements OnInit{
    publicRoomIdentifier = 'dashboard';
    connection = new RTCMultiConnection();
    meetingId:string;
    userName:string;
    passwordValue:string;
    alertTitle:string;
    alertSpecial:string;
    alertMessage:string;
    showConfirmBox:boolean;
    joinDisable:boolean;
    createDisable:boolean;
    userNameValue:Subscription;
    constructor(private route: ActivatedRoute,public dialog: MatDialog, private EncrDecr: EncrDecrService, private service:UrlService) { 
        
        console.log('Called Constructor');
        this.route.queryParams.subscribe(params => {
            if(JSON. parse(localStorage.getItem("currentUser1"))){
                if(params['id'] == JSON. parse(localStorage.getItem("currentUser1"))['username']
                ||params['id'] == JSON. parse(localStorage.getItem("currentUser2"))['username']){
                    this.userNameValue =  this.userName = params['id']  ; 
                }else{
                    var href = location.href+'/login';
                    window.open('http://localhost:4200/login?returnUrl=%2F','_self')
                    
                }
            }else{
                var href = location.href+'/login';
                window.open('http://localhost:4200/login?returnUrl=%2F','_self')
                
            }
          

            var rString = this.randomString(40, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            this.meetingId = rString;
        });
    }

    randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    ngOnInit(){
        
        this.connection.socketURL = 'https://localhost:9001/';
        this.connection.publicRoomIdentifier = this.publicRoomIdentifier;
        this.connection.socketMessageEvent = this.publicRoomIdentifier;
        // this.connection.autoCloseEntireSession = true;
        this.connection.connectSocket((socket) =>{
            // this.looper();
        
            socket.on('disconnect', ()=> {
                location.reload();
            });
        });
        
    }

    btnJoinHiddenRoom(event){
        var roomid = this.meetingId;
        if (!roomid || !roomid.replace(/ /g, '').length) {
            this.alertBox('Please enter room-id.', 'Room ID Is Required');
            return;
        }
    
        var fullName = this.userName;
        if (!fullName || !fullName.replace(/ /g, '').length) {
            this.alertBox('Please enter your name.', 'Your Name Is Required');
            return;
        }
    
        this.connection.extra.userFullName = fullName;
    
        this.joinAHiddenRoom(roomid);
    }

    alertBox(message:string, title:string, specialMessage?:string, callback?:any) {
        this.dialog.open(AlertModal,{data:{'message':message,'specialMessage':specialMessage,'title':title}});
    }

    joinAHiddenRoom(roomid) {
        
        this.joinDisable = true;
        
    
        this.connection.checkPresence(roomid, (isRoomExist)=> {
            if (isRoomExist === false) {
                this.alertBox('No such room exist on this server. Room-id: ' + roomid, 'Room Not Found');
                this.joinDisable = false;
                return;
            }
    
           this.connection.sessionid = roomid;
            this.connection.isInitiator = false;
            this.openCanvasDesigner();
    
            this.joinDisable = false;
        })
    }


    btnCreate(event) {
        var roomid = this.meetingId;
        if (!roomid || !roomid.replace(/ /g, '').length) {
            this.alertBox('Please enter room-id.', 'Room ID Is Required');
            return;
        }
    
        var fullName = this.userName;
        if (!fullName || !fullName.replace(/ /g, '').length) {
            this.alertBox('Please enter your name.', 'Your Name Is Required');
            return;
        }
    
        this.connection.extra.userFullName = fullName;
    
        var roomPassword = this.passwordValue;
      if (!roomPassword || !roomPassword.replace(/ /g, '').length) {
          this.alertBox('Please enter room password.', 'Password Box Is Empty');
          return;
      }

      this.connection.password = roomPassword;
    
        this.createDisable = true;
    
        
    
        this.connection.checkPresence(roomid, (isRoomExist)=> {
            if (isRoomExist === true) {
                this.alertBox('This room-id is already taken and room is active. Please join instead.', 'Room ID In Use');
                return;
            }
    
            //if ($('#chk-hidden-room').prop('checked') === true) {
                // either make it unique!
                // connection.publicRoomIdentifier = connection.token() + connection.token();
    
                // or set an empty value (recommended)
              //  this.connection.publicRoomIdentifier = '';
            //}
    
            this.connection.sessionid = roomid;
            this.connection.isInitiator = true;
            this.openCanvasDesigner();
           // Push.config({ serviceWorker: '/demos/js/serviceWorker.min.js'});
    
    
            //Push.create('Meeting created!')
    
            this.createDisable = false;
        });
    };
    
    
    openCanvasDesigner() {
        
        var href = location.origin + '/home/group/meeting-screen?open=' + this.connection.isInitiator + '&sessionid=' + this.connection.sessionid + '&publicRoomIdentifier=' + this.connection.publicRoomIdentifier + '&userFullName=' + this.connection.extra.userFullName;
        
        if(!!this.connection.password) {
          href += '&password=' + this.connection.password;
        }
    
        var newWin = window.open(href,'_blank');
        if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
            var html = '';
            html += '<p>Please click following link:</p>';
            html += '<p><a href="' + href + '" target="_blank">';
            if(this.connection.isInitiator) {
              html += 'Click To Open The Room';
            }
            else {
              html += 'Click To Join The Room';
            }
            html += '</a></p>';
            this.alertBox(html, 'Popups Are Blocked');
        }
    }
}