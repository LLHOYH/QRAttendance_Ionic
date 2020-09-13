import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiCallingService } from 'src/services/api-calling.service';
import { PageElementsService } from 'src/services/page-elements.service';
import { UUIDService } from 'src/services/uuid.service';
import { error } from 'protractor';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  @ViewChild("adminNumber", { static: true }) adminNumber;
  @ViewChild("verifCode", { static: true }) verifCode;


  uID: any;
  registerForm: FormGroup;
  verifBtnClickable: boolean = false;
  studentDetail: any;
  msgJson: any;
  token: any;
  result: any;
  verifResult: any;
  sendCodeMsg: string;


  error_messages = {
    'adminNumber': [
      { type: 'required', message: 'Admin number is required' },
      { type: 'pattern', message: 'Invalid admin number' }
    ],
    'verifCode': [
      { type: 'required', message: 'Verification Code is required' },
    ]
  }

  constructor(public platforms: Platform, public formBuilder: FormBuilder,
    public toast: ToastController, public http: HttpClient, private router: Router,
    private apiSvc: ApiCallingService, private pageSvc: PageElementsService, private uuidSvc: UUIDService) {

    this.registerForm = this.formBuilder.group({
      adminNumber: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{6}[a-zA-Z]{1}'),
        Validators.maxLength(7)
      ])),
      verifCode: new FormControl('', Validators.compose([
        Validators.required,
      ]))
    });


  }

  async ngOnInit() {
    this.uID = await this.uuidSvc.GetUUID();
  }

  //Admin-Number-Input Keyup
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
    console.log(this.registerForm.invalid);
    if (!this.registerForm.invalid) {
      this.pageSvc.PresentSpinner(null);

      //verify the code against database through api.
      this.verifResult = await this.apiSvc.ValidateVerification(this.adminNumber.value, this.verifCode.value);

      //if code is valid, verify admin number status
      if (this.verifResult.Success) {
        this.router.navigateByUrl("/reset-password/" + this.adminNumber.value);
      }
      else {
        this.pageSvc.PresentToast(this.verifResult.Error_Message);
      }
      this.pageSvc.DismissSpinner();
    }
  }
}
