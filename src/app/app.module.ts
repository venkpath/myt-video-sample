import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPage } from './video-conference/pages/main-page/main-page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertModal } from './video-conference/components/alert-modal/alert-modal';
import { MeetingPageComponent } from './video-conference/pages/meeting-page/meeting-page';
import { PeerToPeerComponent } from './video-conference/pages/meeting-page/peer-peer/peer-to-peer';
import { ScreenRecord } from './video-conference/components/screen-record/screen-record';
import { TimerComponent } from './video-conference/components/timer-component/timer-component';

@NgModule({
  declarations: [
    AppComponent,
    MainPage,
    AlertModal,
    MeetingPageComponent,
    PeerToPeerComponent,
    ScreenRecord,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [MatDialog],
  bootstrap: [AppComponent],
  entryComponents: [AlertModal]

})
export class AppModule { }
