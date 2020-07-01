import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPage } from './video-conference/pages/main-page/main-page';
import { MeetingPageComponent } from './video-conference/pages/meeting-page/meeting-page';
import { PeerToPeerComponent } from './video-conference/pages/meeting-page/peer-peer/peer-to-peer';


const routes: Routes = [
  {
    path:'home/group',
    component:MainPage
  },{
    path:'home/group/meeting-screen',
    component:MeetingPageComponent
  },{
    path:'home',
    component:PeerToPeerComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
