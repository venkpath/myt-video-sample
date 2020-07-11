import { Injectable, EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UrlService {
    emmiter : EventEmitter<any> = new EventEmitter();


    
    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            
        });
    }

}