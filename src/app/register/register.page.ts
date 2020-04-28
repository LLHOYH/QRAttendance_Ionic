import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { ToastController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  @ViewChild('adminNum', {static:true}) adminNum;
  @ViewChild('password', {static:true}) password;
  @ViewChild('Cpassword', {static:true}) Cpassword;


  //my error msg
  error_messages = {
    'adminNum': [
      {type: 'required', message: 'Admin number is required'},
      {type: 'pattern', message: 'Invalid admin number'}
    ],
    'password': [
      {type: 'required', message: 'password is required'},
      {type: 'pattern', message: 'Must contain a combination of uppercase and lowercase letter, number and special character!'},
      {type: 'minlength', message: 'Minimium 8 characters'},
      {type: 'maxlength', message: 'Maximium 20 characters'}
    ],
  }

  registerForm: FormGroup;
  uID: string = "";

  constructor(public platforms: Platform, private uniqueDeviceID: UniqueDeviceID, private navCtrl:NavController, public formBuilder: FormBuilder, public toast: ToastController, public http: HttpClient) { 
    // Get unique device ID
    this.platforms.ready().then(() => {
      uniqueDeviceID.get()
       .then((uuid: any) => {this.uID = uuid;})
       .catch((error: any) => console.log("UIDERR : " + error));
    });

    this.registerForm = this.formBuilder.group({
      adminNum: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{6}[a-zA-Z]{1}'),
        Validators.maxLength(7)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('.*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*]).*'),
        Validators.minLength(8),
        Validators.maxLength(20)
      ]))
    })
  }


  confirmedPw:Boolean = true;
  buttonClikable:Boolean = false;  //for disabling button

  confirmPw() {
    if (this.password.value != this.Cpassword.value) {
      this.confirmedPw = false;
      this.buttonClikable = false;
    } else if (this.password.value == this.Cpassword.value) {
      
      this.confirmedPw = true;

      if (this.registerForm.valid && this.uID.length == 0)
        this.buttonClikable = true;
    }

  }

  RegisterAccount(){
      var url = 'https://serverapi0.herokuapp.com/register';
      var postData = JSON.stringify({
        AdminNumber: this.registerForm.value['adminNum'],
        Password: this.registerForm.value['password'],
        UUIDNo: this.uID
        });
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
        })
      };
  
      this.http.post(url, postData, httpOptions).subscribe((data) => {
        console.log('postData:', postData)
        console.log(data);
        if (data) {
          this.registerfail()
        } else if (data) {
          this.register()
        }
       }, error => {
        console.log(error);
      });
  }

    // Toast for successful registration and run another function (i guessed)
    async register() {
      var admin = this.registerForm.value['adminNum'];
  
      let toast = await this.toast.create({
        message: 'Account created for ' + admin,
        duration: 3000,
        position: 'top'
      });
      this.navCtrl.navigateForward("/login")
      return await toast.present();
    }
  
    async registerfail() {
      var admin = this.registerForm.value['adminNum'];
  
      let toast = await this.toast.create({
        message: 'Error! \nEither ' + admin + ' existed or another account already registered on this device',
        duration: 3000,
        position: 'top'
      });
      
      return await toast.present();
    }

  ngOnInit() {

  }

}

