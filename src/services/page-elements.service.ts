import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PageElementsService {

  isLoading = false;

  constructor(public loadingController: LoadingController,public toast: ToastController, public alertCtrl:AlertController) { }

  async PresentSpinner(msg:string) {
    this.isLoading = true;
    return await this.loadingController.create({
      spinner: 'lines',
      translucent: true,
      message:msg,
      backdropDismiss:true
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async DismissSpinner() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }

  async PresentToast(message: string) {
    let toast = await this.toast.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    return await toast.present();
  }

  async PresentToastWithIcon(success: boolean, message: string) {
    var icon;
    if (success) {
      icon = '<ion-icon style="font-size:25px;" name="checkmark-circle-outline"></ion-icon> ';
    }
    else {
      icon = '<ion-icon style="font-size:25px;" name="close-circle-outline"></ion-icon> ';
    }
    let toast = await this.toast.create({
      message: icon + message,
      duration: 3000,
      position: 'top',
      cssClass: 'QRHomeToast',
    });

    return await toast.present();
  }
  
  async PresentAlert(header: any,subHeader: any,message: any) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: message,
      backdropDismiss:true
    });

    await alert.present();
  }
  
  async PresentAlertWithOk(header: string, subHeader: string, message: any) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
        }
      }]
    });

    await alert.present();
  }

  async AlertDebug(message: any) {
    const alert = await this.alertCtrl.create({
      header: "header",
      subHeader: "subHeader",
      message: message,
    });

    await alert.present();
  }
}