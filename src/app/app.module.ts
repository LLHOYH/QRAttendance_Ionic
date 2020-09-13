import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common'

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { PageElementsService } from 'src/services/page-elements.service';
import { ApiCallingService } from 'src/services/api-calling.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { UUIDService } from 'src/services/uuid.service';

import { SelectIconPopoverPageModule } from './select-icon-popover/select-icon-popover.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    IonicStorageModule.forRoot(),
    SelectIconPopoverPageModule

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP,
    DatePipe,
    Keyboard,
    UniqueDeviceID,
    QRScanner,
    NativeAudio,
    Geolocation,
    ApiCallingService,
    LocalStorageService,
    PageElementsService,
    UUIDService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
