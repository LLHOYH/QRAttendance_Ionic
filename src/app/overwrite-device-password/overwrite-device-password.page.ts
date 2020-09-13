import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallingService } from '../../services/api-calling.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PageElementsService } from 'src/services/page-elements.service';
import { UUIDService } from 'src/services/uuid.service';

@Component({
  selector: 'app-overwrite-device-password',
  templateUrl: './overwrite-device-password.page.html',
  styleUrls: ['./overwrite-device-password.page.scss'],
})
export class OverwriteDevicePasswordPage implements OnInit {

  @ViewChild("verifyPassword", { static: true }) verifyPassword;

  overwrite: boolean;
  studentDetail: any;
  adminNum: string;
  dbPassword: string;
  uID: any;
  result:any;

  //Enter this page from Login page or Register-Admin-Number page
  constructor(public platforms: Platform, public formBuilder: FormBuilder, public toast: ToastController,
    public http: HttpClient, private router: Router,
    private acRoute: ActivatedRoute, private apiSvc: ApiCallingService, private storageSvc :LocalStorageService,
    private pageSvc: PageElementsService, private uuidSvc:UUIDService) {

    this.adminNum = this.acRoute.snapshot.paramMap.get("AdminNumber");
  }

  async ngOnInit() {
    this.uID = await this.uuidSvc.GetUUID();
  }

  //Verify-Password-Icon Clicked
  async VerifyPassword() {
    await this.pageSvc.PresentSpinner('Login in...');
    
      this.result = await this.apiSvc.OverwriteDevice(this.adminNum, this.uID, this.verifyPassword.value);

      if(this.result.Success){
        //logs in if successful.
        //store the token return from api for next time auto login.
        //store admin number for other page's usage
        this.storageSvc.SetToken(this.result.AccountToken);
        this.storageSvc.SetAdminNumber(this.adminNum);
        this.router.navigateByUrl("tabs/qrhome",{replaceUrl:true});
      }
      else{
        this.pageSvc.PresentToast(this.result.Error_Message);
      }

      this.pageSvc.DismissSpinner();
  }


}
