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

import { HomeComponent } from './video-conference/home';
import { LoginComponent } from './video-conference/login';
import { RegisterComponent } from './video-conference/register';
import { AlertComponent } from './video-conference/components/alert-component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor, fakeBackendProvider, ErrorInterceptor } from './video-conference/helpers';
import { ReactiveFormsModule } from '@angular/forms';
import { EncrDecrService } from './video-conference/services/encode';
import { UrlService } from './video-conference/services/url.service';

@NgModule({
  declarations: [
    AppComponent,
    MainPage,
    AlertModal,
    MeetingPageComponent,
    PeerToPeerComponent,
    ScreenRecord,
    TimerComponent,
    HomeComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
        HttpClientModule,
  ],
  providers: [MatDialog, EncrDecrService,UrlService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    

    // provider used to create fake backend
    fakeBackendProvider],
  bootstrap: [AppComponent],
  entryComponents: [AlertModal]

})
export class AppModule { }
