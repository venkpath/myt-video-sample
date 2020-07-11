import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrService } from 'src/app/video-conference/services/encode';

import { UrlService } from 'src/app/video-conference/services/url.service';

declare var Peer:any;
declare var myjsapp:any;
declare var peerapp:any;
@Component({
    selector:'peer-to-peer',
    templateUrl:'peer-to-peer.html',
    styleUrls:['peer-to-peer.css']
})
export class PeerToPeerComponent implements OnInit{

    userName:string;
    constructor(private route: ActivatedRoute,private router: Router,private service :UrlService){
        this.route.queryParams.subscribe(params => {
           
            this.userName = params['id'];
        })
    }

    ngOnInit(){
        
        // Peer();
        // myjsapp(peerapp);
        this.loadScript('../../../../../assets/js/peer.js');
        this.loadScript('../../../../../assets/js/peer-client.js');
        this.loadScript('../../../../../assets/js/vue.js');
        this.loadScript('../../../../../assets/js/app.js');
        
        // this.loadScript('http://www.some-library.com/library.js');
        
    }

    createRoom(event){
        
        this.router.navigate(['/home/group'], { queryParams:  {id:this.userName}, skipLocationChange: false});
      //  var href = location.origin + '/home/group?id='+(encrypted);
        //window.open(href,'_blank');
    }
    public loadScript(url) {
        let body = <HTMLDivElement> document.body;
        let script = document.createElement('script');
        script.innerHTML = '';
        script.src = url;
        script.async = true;
        script.defer = true;
        body.appendChild(script);
}
}