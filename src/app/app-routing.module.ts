import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPage } from './video-conference/pages/main-page/main-page';
import { MeetingPageComponent } from './video-conference/pages/meeting-page/meeting-page';
import { PeerToPeerComponent } from './video-conference/pages/meeting-page/peer-peer/peer-to-peer';

import { HomeComponent } from './video-conference/home';
import { LoginComponent } from './video-conference/login';
import { AuthGuard } from './video-conference/helpers';
import { RegisterComponent } from './video-conference/register';
import { JoinRoomComponent } from './video-conference/pages/meeting-page/join-room/join-room';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    //{ path: '**', redirectTo: '' },//
  {
    path:'home/group',
    component:MainPage
  },{
    path:'home/group/meeting-screen',
    component:MeetingPageComponent
  },{
    path:'home',
    component:PeerToPeerComponent
  },{
    path:'joinmeeting',
    component:JoinRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
