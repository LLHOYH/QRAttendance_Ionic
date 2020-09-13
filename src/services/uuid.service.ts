import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

@Injectable({
  providedIn: 'root'
})
export class UUIDService {

  uID: string;
  constructor(public platforms: Platform, private uniqueDeviceID: UniqueDeviceID) { }

  GetUUID() {

    return new Promise((resolve) => {

      this.platforms.ready().then(() => {

        this.uniqueDeviceID.get().then((uuid: any) => {
          this.uID = uuid;
          resolve(this.uID);
        })
          .catch((error: any) => {
            //this is for the purpose of ionic serve
            //testing purpose, use a hardcoded UUID
            if (error.toString() == 'cordova_not_available' && (this.platforms.is('mobileweb') || !this.platforms.is('cordova')))
              resolve('HardcodedUUID');
          });
      });
    })
  }

}
