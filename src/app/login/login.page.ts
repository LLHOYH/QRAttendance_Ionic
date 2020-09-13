import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, ToastController, AlertController} from '@ionic/angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiCallingService } from 'src/services/api-calling.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PageElementsService } from 'src/services/page-elements.service';
import { UUIDService } from 'src/services/uuid.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild("adminNumber", { static: true }) adminNumber;
  @ViewChild("password", { static: true }) password;


  uID: any;
  loginForm: FormGroup;
  btnClickable: boolean = false;
  studentDetail: any;
  msgJson: any;
  token: any;
  loading: any;
  totalOverwriteChance:number = 3;
  settingResult:any;

  studentResult:any;

  error_messages = {
    'adminNumber': [
      { type: 'required', message: 'Admin number is required' },
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
    ]
  }


  constructor(public platforms: Platform, public formBuilder: FormBuilder,
    public toast: ToastController, public http: HttpClient, private alertCtrl: AlertController, private router: Router,
    private apiSvc: ApiCallingService, private storageSvc: LocalStorageService, private pageSvc: PageElementsService,
    private uuidSvc:UUIDService) {

    this.loginForm = this.formBuilder.group({
      adminNumber: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
      ]))
    });
  }

  async ngOnInit() {
    this.uID = await this.uuidSvc.GetUUID();
  }

  ionViewWillEnter() {
    this.LoginOnAppLaunch();
  }

  //when login page being loaded,
  //check if the device's storage contains a token
  //if contains token, verify using api if token is valid 
  //login if token is valid. No action if invalid and wait for password to login.
  async LoginOnAppLaunch() {
    this.token = await this.storageSvc.GetToken();
    if (this.token != null) {
      await this.pageSvc.PresentSpinner(null);

      await this.apiSvc.LoginWithToken(this.uID, this.token).then(async (authResult: any) => {

        if (authResult.Authenticated) { //if token is correct, login
          if (authResult.AdminNumber != null) {
            this.storageSvc.SetAdminNumber(authResult.AdminNumber)
            this.router.navigateByUrl("tabs/qrhome", { replaceUrl: true });
          }
        }
        else { // token not correct, set token to null, so that when user login with password, a new token will be generated
          this.storageSvc.SetToken(null);
        }
        await this.pageSvc.DismissSpinner();
      })
    }
    await this.pageSvc.DismissSpinner();
  }

  //Login-Button Clicked
  async Login() {
    await this.pageSvc.PresentSpinner('Login in...');

    this.token = await this.storageSvc.GetToken();
    this.msgJson = await this.apiSvc.LoginWithPassword(this.adminNumber.value, this.password.value, this.uID, this.token);
    //the property under msgJson are set in api.
    //different ID has different meaning. Set in API.

    if (this.msgJson != null) {
      if (this.msgJson.ID == 1) {  //ID 1 means account is authenticated, and api returns a Token for next time auto login.
        
        //store the token return from api for next time auto login.
        if (this.token == null && this.msgJson.AccountToken != null) {
          this.storageSvc.SetToken(this.msgJson.AccountToken);
        }

        //store admin number for other page's usage
        this.storageSvc.SetAdminNumber(this.adminNumber.value);
        this.router.navigateByUrl('/tabs/qrhome');
      }
      else if (this.msgJson.ID == 2) {  // ID 2 means account was registered on other device.

        //check if the overwrite device feature is enabled.
        this.settingResult = await this.apiSvc.GetChangeDeviceSettings();

        if(this.settingResult.Success && (this.settingResult.Setting_Results.OverwriteEnabled == 1)){  //if equal 1 means true

          this.totalOverwriteChance = this.settingResult.Setting_Results.TotalNumberOfChances;
          this.PresentAlertConfirm('Overwrite previous device record?', "This account has already registered on another device! Do you want to overwrite previous device record?", "OverWrite");
        }
        else{
          this.pageSvc.PresentAlert("Unable to Login",null,"This account has already registered on another device!");
        }
      }
      else if (!this.msgJson.Success) {
        this.pageSvc.PresentToast(this.msgJson.Error_Message);
      }
    }

    await this.pageSvc.DismissSpinner();
  }

  async CheckInputsValidity() {
    if (this.adminNumber.value != null && this.password.value != null) {
      if (this.loginForm.valid && this.uID.length != 0) {
        this.btnClickable = true;
      }
      else {
        this.btnClickable = false;
      }
    }
    else {
      this.btnClickable = false;
    }
  }

  //checks how many number of available times does the student left to register on a new device
  async ToOverwriteDeviceHandler(){

    this.studentResult =  await this.apiSvc.GetStudentByAdminNumber(this.adminNumber.value);

    if(this.studentResult.StudentInfo!=null){
      this.studentDetail = this.studentResult.StudentInfo[0];
    }

    if((this.totalOverwriteChance - this.studentDetail.TimesOfOverwriteDevice) > 0){
      this.router.navigateByUrl("/overwrite-device-password/" + this.adminNumber.value);
    }
    else{
      this.pageSvc.PresentAlert("Unable to Overwrite Device", null, "Your account has reached the maximum number of times to register on a new device.")
    }
  }

  async PresentAlertConfirm(header: string, message: string, OkButtonText: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: OkButtonText,
          handler: () => {
            this.ToOverwriteDeviceHandler();
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillLeave(){
    this.loginForm.reset();
  }

}
