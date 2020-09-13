import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { PageElementsService } from 'src/services/page-elements.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})


export class ScannerPage implements OnInit {

  scanSub: any;
  
  constructor(public platforms: Platform, public navCtrl:NavController,
    public http: HttpClient, private router: Router,
    private pageSvc:PageElementsService, private audio: NativeAudio, private qrScanner:QRScanner) {

  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    
    this.TakeAttendance();

    //load a audio into audio storage. To be used when scanning complete.
    this.platforms.ready().then(() => {
      this.audio.preloadSimple('attendanceTaken', 'assets/Audios/scanDoneNoti.m4r');
    });
  }

  //opens up scanner and wait for scanner to detect QR Code.
  TakeAttendance() {
    
    this.platforms.ready().then(() => {

      this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          this.qrScanner.show();
          this.AddScannerView();

          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            if (text != null) {
                this.audio.play('attendanceTaken');
                this.qrScanner.destroy(); // hide camera preview
                this.scanSub.unsubscribe(); // stop scanning
                this.router.navigateByUrl("/tabs/qrhome/Page_Scanner/"+text);
            }
          });
        }
      })
      .catch((e: any) => { 
          //camera permission denied. Simple handler will do. 
          //as before redirecting to this page, already check for permission and handled error.
          this.pageSvc.PresentAlert("Error",null,"Unexpected Error Occur.");
          this.router.navigateByUrl("/tabs/qrhome");
      })
    })
  }

  //cordova plugin - scanner has a issue, which is ->
  //scanner camera shows up behind all the pages.
  //so by doing this step (together with the css set in global.scss),
  //pages that stacked on top of camera preview will be transparent, so camera preview can show up.
  AddScannerView(){
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('scannerView');
    window.document.body.style.backgroundColor = 'transparent';
  }

  //after scanning's done, set the pages back to normal background.
  RemoveScannerView(){
    window.document.body.style.backgroundColor = '#FFFFFF';
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('scannerView');
  }

  ionViewWillLeave(){
    this.qrScanner.destroy(); // completely remove camera preview
    this.scanSub.unsubscribe(); // stop scanning
    this.RemoveScannerView();
  }

}
