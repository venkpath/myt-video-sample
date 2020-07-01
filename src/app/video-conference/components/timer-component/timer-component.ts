import { Component,OnInit } from '@angular/core';
import {Observable} from 'rxjs';
// import {timer} from '../../../../../node_modules/rxjs/observable/timer';

@Component({
  selector: 'timer-component',
  templateUrl: 'timer-component.html',
  styleUrls: [ 'timer-component.css' ]
})
export class TimerComponent{
  
 
 timerCompleted($event){
   console.log($event)
 }
  
}
