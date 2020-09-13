import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallingService } from 'src/services/api-calling.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PageElementsService } from 'src/services/page-elements.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  @ViewChild('oldPassword', { static: true }) oldPassword;
  @ViewChild('newPassword', { static: true }) newPassword;
  @ViewChild('cfPassword', { static: true }) cfPassword;

  error_messages = {
    'oldPassword': [
      { type: 'required', message: 'password is required' },
    ],
    'newPassword': [
      { type: 'required', message: 'password is required' },
      { type: 'pattern', message: 'Require a combination of uppercase & lowercase letter, number and special character!' },
      { type: 'minlength', message: 'Minimium 8 characters' },
      { type: 'maxlength', message: 'Maximium 20 characters' }
    ]
  }

  changePwForm: FormGroup;
  studentDetail: any;
  adminNum: any;
  passwordMatch: boolean = false;
  btnClickable: boolean = false;
  updateResult: any;
  verifyResult: any;
  loading: any;

  constructor(public platforms: Platform, public formBuilder: FormBuilder, public toast: ToastController,
    public http: HttpClient, private router: Router,
    private acRoute: ActivatedRoute, private apiSvc: ApiCallingService, private storageSvc: LocalStorageService,
    private pageSvc: PageElementsService) {

    this.changePwForm = this.formBuilder.group({
      oldPassword: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      newPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('.*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*]).*'),
        Validators.minLength(8),
        Validators.maxLength(20)
      ]))
    })

  }

  async ngOnInit() {
    await this.storageSvc.GetAdminNumber().then((adminNum) => {
      this.adminNum = adminNum;
      this.ConfirmPw();
    });
  }

  //Password-Input Keyup
  async ConfirmPw() {
    if (this.newPassword.value != this.cfPassword.value) {
      this.passwordMatch = false;
      this.btnClickable = false;
    } else if (this.newPassword.value != null && this.newPassword.value == this.cfPassword.value) {
      this.passwordMatch = true;

      if (this.changePwForm.valid)
        this.btnClickable = true;
      else
        this.btnClickable = false;
    }
  }

  //Change-Password-Button Clicked
  async ChangePassword() {
    
    await this.pageSvc.PresentSpinner('Updating...');

    this.verifyResult = await this.apiSvc.VerifyPassword(this.adminNum, this.oldPassword.value)

    if (this.verifyResult.Success) { //if verify password result returned correctly

      if (this.verifyResult.PasswordIsCorrect) {  //if old password is correct

        this.updateResult = await this.apiSvc.UpdatePassword(this.adminNum, this.newPassword.value);
        if (this.updateResult.Success) {  //if update new password successfully
          this.pageSvc.PresentToastWithIcon(true, "Password Has Been Changed!");
          this.router.navigateByUrl("/tabs/profile", { replaceUrl: true });
        }
        else {  //if update new password failed
          this.pageSvc.PresentToastWithIcon(false, this.updateResult.Error_Message);
        }
      }
      else { //if old password is wrong
        this.pageSvc.PresentToastWithIcon(false, "Wrong Old Password!");
      }
    }
    else { //if verify password result returned has error
      this.pageSvc.PresentToastWithIcon(false, "An Error Has Occured!");
    }

    this.pageSvc.DismissSpinner();
  }

  ionViewWillLeave() {
    this.changePwForm.reset();
  }

}
