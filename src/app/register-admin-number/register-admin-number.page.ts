import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiCallingService } from '../../services/api-calling.service';
import { PageElementsService } from 'src/services/page-elements.service';
import { UUIDService } from 'src/services/uuid.service';
@Component({
  selector: 'app-register-admin-number',
  templateUrl: './register-admin-number.page.html',
  styleUrls: ['./register-admin-number.page.scss'],
})
export class RegisterAdminNumberPage implements OnInit {

  @ViewChild('adminNumber', { static: true }) adminNumber;
  @ViewChild("verifCode", { static: true }) verifCode;


  registerForm: FormGroup;
  studentDetail: any;
  uID: any;
  studentsByUUID: any;
  result: any;
  uidAvailResult: any;
  verifResult: any;
  verifBtnClickable: boolean = false;
  totalOverwriteChance: number = 3;

  sendCodeMsg: string;

  studentResult: any;
  settingResult: any;

  error_messages = {
    'adminNumber': [
      { type: 'required', message: 'Admin number is required' },
      { type: 'pattern', message: 'Invalid admin number' }
    ],
    'verifCode': [
      { type: 'required', message: 'Verification Code is required' },
    ]
  }


  constructor(public platforms: Platform, public formBuilder: FormBuilder, public toast: ToastController,
    private alertCtrl: AlertController, private router: Router, private apiSvc: ApiCallingService,
    private pageSvc: PageElementsService, private uuidSvc: UUIDService) {

    this.registerForm = this.formBuilder.group({
      adminNumber: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{6}[a-zA-Z]{1}'),
        Validators.maxLength(7)
      ])),
      verifCode: new FormControl('', Validators.compose([
        Validators.required,
      ]))
    })

  }

  async ngOnInit() {
    this.uID = await this.uuidSvc.GetUUID();
  }

  ValidateAdminNumber() {
    if (!this.registerForm.get('adminNumber').hasError(this.error_messages.adminNumber[0].type) && !this.registerForm.get('adminNumber').hasError(this.error_messages.adminNumber[1].type))
      this.verifBtnClickable = true;
    else
      this.verifBtnClickable = false;
  }

  //Send-Verification-Button Clicked
  async SendVerification() {
    //when get the access to school SMTP server webservice
    //then send code to student's email.
    var verifCode = "";
    var charset = "0123456789";
    var verifCodeLength = 6;

    for (var i = 0; i < verifCodeLength; i++)
      verifCode += charset.charAt(Math.floor(Math.random() * charset.length));

    if (verifCode != null && verifCode.length == 6) {
      this.result = await this.apiSvc.UpdateVerification(this.adminNumber.value, verifCode);

      if (this.result.Success) {
        this.apiSvc.SendEmailToStudents(this.adminNumber.value + "@mymail.nyp.edu.sg", verifCode).then((data) => {
          this.sendCodeMsg = data.toString();
          if (this.sendCodeMsg.includes('Success'))
            this.pageSvc.PresentToast("Check Your School Email For Verification Code!");
          else
            this.pageSvc.PresentToastWithIcon(false, "Failed to Send Verification to Email!");
        }, error => {
          this.pageSvc.PresentToastWithIcon(false, "Error Sending Verification Email!");
        })
      }
      else {
        this.pageSvc.PresentToastWithIcon(false, "Please Check If Your Admin Number Is Correct!");
      }
    }
  }

  //Verify-Code-Icon Clicked
  async VerifyCode() {
    if (!this.registerForm.invalid) {
      this.pageSvc.PresentSpinner(null);

      //verify the code against database through api.
      this.verifResult = await this.apiSvc.ValidateVerification(this.adminNumber.value, this.verifCode.value);
      console.log(this.verifResult);
      //if code is valid, verify admin number status
      if (this.verifResult.Success) {
        this.VerifyAdminNumber();
      }
      else {
        this.pageSvc.PresentToast(this.verifResult.Error_Message);
      }
      this.pageSvc.DismissSpinner();
    }
  }

  //verifiy is admin number is available for registration
  //by checking for:
  //  admin number existance
  //  old device exist (already register on another device)
  //  overwrite device feature is enabled
  async VerifyAdminNumber() {
    if (this.uID != null) {
      this.uidAvailResult = await this.apiSvc.UUIDAvailability(this.uID);
      this.studentsByUUID = this.uidAvailResult.StudentInfo;

      //if gotten result has no error
      if (this.uidAvailResult.Error_Message == null) {

        this.studentsByUUID = this.uidAvailResult.StudentInfo;

        if (this.studentsByUUID.length > 0 && this.studentsByUUID[0].AdminNumber != this.adminNumber.value) {  //if the device is available for new registration
          this.pageSvc.PresentToast("This Device Is Already Registered By Another Account!");
        }
        else if (this.studentsByUUID.length > 0 && this.studentsByUUID[0].AdminNumber == this.adminNumber.value) {  //if the account has already register on current device, go to login
          this.PresentAlertAndNavigate('Account Exist', null, "This account has already registered on this device!");
        }
        else {
          this.studentResult = await this.apiSvc.GetStudentByAdminNumber(this.adminNumber.value); //get student information

          if (this.studentResult.Error_Message == null && this.studentResult.StudentInfo != null) {  //if student result gotten is ok to use
            this.studentDetail = this.studentResult.StudentInfo[0];

            if (this.studentDetail != null) {
              if (this.studentDetail.UUID == null) { //if account is new, no previous register device.
                this.router.navigateByUrl('/register-password/' + this.adminNumber.value);
              }
              else if (this.studentDetail.UUID != this.uID) {  //if account is not new, a old registered device exist

                //check if the overwrite device feature is enabled.
                this.settingResult = await this.apiSvc.GetChangeDeviceSettings();

                if (this.settingResult.Success && (this.settingResult.Setting_Results.OverwriteEnabled == 1)) {  //if equal 1 means true
                  this.totalOverwriteChance = this.settingResult.Setting_Results.TotalNumberOfChances;
                  this.PresentAlertConfirm('Overwrite previous device record?', "This account has already registered on another device! Do you want to overwrite previous device record?", "OverWrite");
                }
                else {
                  this.pageSvc.PresentAlert("Unable to Login", null, "This account has already registered on another device!");
                }

              }
            }
          }
          else if (this.result.Error_Message != null) {
            this.pageSvc.PresentToast(this.result.Error_Message);
          }
          else {
            this.pageSvc.PresentToast("Unexpected Error Occur!");
          }
        }
      }
      else {
        this.pageSvc.PresentToast(this.uidAvailResult.Error_Message);
      }

    }
    else
      this.pageSvc.PresentToastWithIcon(false,"Could Not Detect Your Device ID");
  }

  //checks how many number of available times does the student left to register on a new device
  async ToOverwriteDeviceHandler() {

    //this.studentDetail is already filled with data in the VerifyAdminNumber function

    if ((this.totalOverwriteChance - this.studentDetail.TimesOfOverwriteDevice) > 0) {
      this.router.navigateByUrl("/overwrite-device-password/" + this.adminNumber.value);
    }
    else {
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
            console.log(this.adminNumber.value)
            this.ToOverwriteDeviceHandler();
          }
        }
      ]
    });

    await alert.present();
  }

  async PresentAlertAndNavigate(header: string, subHeader: string, message: any) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl('/login');
        }
      }]
    });

    await alert.present();
  }

  ionViewWillLeave() {
    this.registerForm.reset();
  }

}
