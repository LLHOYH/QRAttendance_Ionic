import { Component, OnInit } from '@angular/core';
import { AlertController, Platform, ToastController, NavController, PopoverController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from 'src/services/local-storage.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiCallingService } from 'src/services/api-calling.service';
import { SelectIconPopoverPage } from '../select-icon-popover/select-icon-popover.page';
import { PageElementsService } from 'src/services/page-elements.service';

@Component({
  selector: 'app-settings',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  student: any;
  adminNum: any;
  profileImgPath: any;
  studentResult: any;
  overwriteDeviceChance: number;

  totalOverwriteChance: number;

  overwriteResult: any;

  constructor(public platforms: Platform,
    public toast: ToastController, public http: HttpClient, private alertCtrl: AlertController,
    private router: Router, private popoverCtrl: PopoverController,
    private apiSvc: ApiCallingService, private storageSvc: LocalStorageService,
    private pageSvc: PageElementsService) {
  }

  async ngOnInit() {

    //get admin number
    await this.storageSvc.GetAdminNumber().then(async (adminNum) => {
      this.adminNum = adminNum;
      
      //set profile icon
      this.profileImgPath = await this.storageSvc.GetProfileIcon();
      if (this.profileImgPath == null) {
        this.profileImgPath = '../assets/ProfileImgs/male1.png';
      }

      //set name (profile)
      if (this.adminNum != null) {
        this.studentResult = await this.apiSvc.GetStudentByAdminNumber(this.adminNum);
        this.overwriteResult = await this.apiSvc.GetChangeDeviceSettings();
        if (this.studentResult.Error_Message == null && this.studentResult.StudentInfo != null && this.overwriteResult.Setting_Results != null) {
          this.student = this.studentResult.StudentInfo[0];
          this.totalOverwriteChance = this.overwriteResult.Setting_Results.TotalNumberOfChances;

          //set overwrite device chance number
          this.overwriteDeviceChance = this.totalOverwriteChance - this.student.TimesOfOverwriteDevice;
        }
        else if (this.studentResult.Error_Message != null) {
          this.pageSvc.PresentToastWithIcon(false, this.studentResult.Error_Message);
        }
      }

    })
  }

  //Profile-Icon Clicked
  async SelectIcons(ev: Event) {
    var popover = await this.popoverCtrl.create({
      component: SelectIconPopoverPage,
      event: ev,
      backdropDismiss: true,
      animated: true,
      showBackdrop: true
    });
    await popover.present();

    //when popover page is dismissied, get profile icon again from storage.
    popover.onDidDismiss().then(async () => {
      this.profileImgPath = await this.storageSvc.GetProfileIcon();
    });
  }

  //Logout-Button Clicked
  async LogOut() {
    this.storageSvc.RemoveAdminNumber();
    this.storageSvc.RemoveToken();
    this.router.navigateByUrl("/login", { replaceUrl: true });
  }

  async PresentConfirmLogout() {
    const alert = await this.alertCtrl.create({
      header: "Logout",
      message: "Confirm Logging Out?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: "Confirm",
          handler: () => {
            this.LogOut();
          }
        }
      ]
    });

    await alert.present();
  }

}
