import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Router } from '@angular/router';
import { ApiCallingService } from 'src/services/api-calling.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PageElementsService } from 'src/services/page-elements.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private keyboard:Keyboard
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.keyboard.disableScroll(false);
      this.keyboard.hideFormAccessoryBar(false);
      if(this.platform.is('android')){
        this.statusBar.hide();
      }
    });
  }
}
