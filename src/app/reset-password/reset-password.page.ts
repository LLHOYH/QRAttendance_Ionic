import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, ToastController} from '@ionic/angular';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallingService } from 'src/services/api-calling.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PageElementsService } from 'src/services/page-elements.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  @ViewChild('password', { static: true }) password;
  @ViewChild('confirmPassword', { static: true }) confirmPassword;

  error_messages = {
    'password': [
      { type: 'required', message: 'password is required' },
      { type: 'pattern', message: 'Must contain a combination of uppercase and lowercase letter, number and special character!' },
      { type: 'minlength', message: 'Minimium 8 characters' },
      { type: 'maxlength', message: 'Maximium 20 characters' }
    ]
  }

  resetForm: FormGroup;
  studentDetail: any;
  adminNum: string;
  passwordMatch: boolean = false;
  btnClickable: boolean = false;
  updateResult: any;
  paramAdminNum: string;
  loading:any;
  
  constructor(public platforms: Platform, public formBuilder: FormBuilder, public toast: ToastController,
    public http: HttpClient, private router: Router,
    private acRoute: ActivatedRoute, private apiSvc: ApiCallingService, private storageSvc :LocalStorageService,
    private pageSvc: PageElementsService) {

    this.paramAdminNum = this.acRoute.snapshot.paramMap.get("AdminNumber");

    this.resetForm = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('.*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*]).*'),
        Validators.minLength(8),
        Validators.maxLength(20)
      ]))
    })

  }

  async ngOnInit() {
    this.ConfirmPw();
  }

  //Password-Input Keyup
  async ConfirmPw() {
    if (this.password.value != this.confirmPassword.value) {
      this.passwordMatch = false;
      this.btnClickable = false;
    } else if (this.password.value!=null && this.password.value == this.confirmPassword.value ) {
      this.passwordMatch = true;
      this.btnClickable = true;

      if (this.resetForm.valid) {
        this.btnClickable = true;
      }
    }
  }

  //Reset-Password-Button Clicked
  async UpdatePassword() {
    await this.pageSvc.PresentSpinner('Updating...');

      this.updateResult = await this.apiSvc.UpdatePassword(this.paramAdminNum, this.password.value);
      
      if (this.updateResult.Success) {

        this.pageSvc.PresentToast("Password Has Been Reset!");

        //Remove old records from local storage
        await this.storageSvc.RemoveToken();
        await this.storageSvc.RemoveAdminNumber();

        this.router.navigateByUrl("/login",{replaceUrl:true});
      }
      else {
        this.pageSvc.PresentToast(this.updateResult.Error_Message);
      }

    this.pageSvc.DismissSpinner();
  }

  ionViewWillLeave(){
    this.resetForm.reset();
  }

}
