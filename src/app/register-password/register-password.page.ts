import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiCallingService } from 'src/services/api-calling.service';
import { Platform, ToastController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PageElementsService } from 'src/services/page-elements.service';
import { UUIDService } from 'src/services/uuid.service';

@Component({
  selector: 'app-register-password',
  templateUrl: './register-password.page.html',
  styleUrls: ['./register-password.page.scss'],
})
export class RegisterPasswordPage implements OnInit {

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

  registerForm: FormGroup;
  studentDetail: any;
  uID: any;
  adminNum: string;
  passwordMatch: boolean = false;
  btnClickable: boolean = false;
  registerResult: any;
  paramAdminNum: string;
  loading:any;

  constructor(public platforms: Platform, public formBuilder: FormBuilder, public toast: ToastController,
    public http: HttpClient, private router: Router,
    private acRoute: ActivatedRoute, private apiSvc: ApiCallingService, private storageSvc :LocalStorageService,
    private pageSvc: PageElementsService, private uuidSvc:UUIDService) {

    this.paramAdminNum = this.acRoute.snapshot.paramMap.get("AdminNumber");

    this.registerForm = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('.*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*]).*'),
        Validators.minLength(8),
        Validators.maxLength(20)
      ]))
    })
  }

  async ngOnInit() {
    this.uID = await this.uuidSvc.GetUUID();
    this.confirmPw();
  }

  //Password-Input Keyup
  async confirmPw() {
    if (this.password.value != this.confirmPassword.value) {
      this.passwordMatch = false;
      this.btnClickable = false;
    } else if (this.password.value!=null && this.password.value == this.confirmPassword.value ) {
      this.passwordMatch = true;
      this.btnClickable = true;

      if (this.registerForm.valid && this.uID.length != 0) {
        this.btnClickable = true;
      }
    }
  }

  //Register-Button Clicked
  async RegisterAccount() {
    await this.pageSvc.PresentSpinner('Registering...');

    if (this.password.value != null && this.uID != null) {
      
      this.registerResult = await this.apiSvc.RegisterAccount(this.paramAdminNum, this.password.value, this.uID);

      if (this.registerResult.Success) {
        this.storageSvc.SetToken(this.registerResult.AccountToken);
        this.storageSvc.SetAdminNumber(this.paramAdminNum);
        this.router.navigateByUrl("tabs/qrhome",{replaceUrl:true});
      }
      else {
        this.pageSvc.PresentToast(this.registerResult.Error_Message);
      }
    }
    else if(this.uID == null)
      this.pageSvc.PresentToastWithIcon(false,"Could Not Detect Your Device ID");

    this.pageSvc.DismissSpinner();
  }

  ionViewWillLeave(){
    this.registerForm.reset();
  }

}
