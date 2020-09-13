import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { map, timeout } from 'rxjs/operators';
import { error } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class ApiCallingService {

  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
    })
  };

  

  studentDetail: any;
  registerOutput: any;
  postResult: any;
  getResult: any;
  results: any;

  url: string;
  postParam: any;

  constructor(private http: HttpClient) { }



  //Self Written Apis From Here ------------------------------------------------------------------------------------
  //Self Written Apis From Here ------------------------------------------------------------------------------------
  //Self Written Apis From Here ------------------------------------------------------------------------------------
  //Self Written Apis From Here ------------------------------------------------------------------------------------
  //Self Written Apis From Here ------------------------------------------------------------------------------------


  //get a student's information by his adminNumber.
  GetStudentByAdminNumber(adminNum: string) {
    let url = "https://qrapi0.herokuapp.com/StudentByAdminNum";
    let postParam = JSON.stringify({
      AdminNumber: adminNum
    });

    return this.CallPost(url, postParam);
  }

  //check if student's mobile UUID has already been registered by other device.
  UUIDAvailability(UUID: string) {
    let url = "https://qrapi0.herokuapp.com/UUIDAvailability";
    let postParam = JSON.stringify({
      UUID: UUID
    });

    return this.CallPost(url, postParam);
  }

  //Called when login through admin number and password. Authenticate if credentials are correct
  LoginWithPassword(adminNum: string, password: string, uuID: string, token: string) {
    let url = "https://qrapi0.herokuapp.com/Login_Password";
    let postParam = JSON.stringify({
      AdminNumber: adminNum,
      InputPassword: password,
      UUID: uuID,
      Token: token
    });

    return this.CallPost(url, postParam);
  }

  //Called when login through Token. It is a automatically login function and operates when app if launch.
  LoginWithToken(uuID: string, token: string) {
    let url = "https://qrapi0.herokuapp.com/Login_Token";
    let postParam = JSON.stringify({
      UUID: uuID,
      Token: token
    });

    return this.CallPost(url, postParam);
  }

  //Called when student wants to register account
  RegisterAccount(adminNum: string, password: string, uuID: string) {
    let url = "https://qrapi0.herokuapp.com/Register";
    let postParam = JSON.stringify({
      AdminNumber: adminNum,
      InputPassword: password,
      UUID: uuID
    });

    return this.CallPost(url, postParam);
  }

  //Called when student requires a verification code, which is updated in database in this api.  (send to their email in other api)
  UpdateVerification(adminNum: string, verifCode: string) {

    let url = "https://qrapi0.herokuapp.com/UpdateVerification";
    let postParam = JSON.stringify({
      AdminNumber: adminNum,
      VerificationCode: verifCode
    });

    return this.CallPut(url, postParam);
  }

  //Called when need to verify if they verification code is correct and not expired
  ValidateVerification(adminNum: string, verifCode: string) {

    let url = "https://qrapi0.herokuapp.com/ValidateVerification";
    let postParam = JSON.stringify({
      AdminNumber: adminNum,
      VerificationCode: verifCode
    });

    return this.CallPost(url, postParam);
  }

  //Called when student wants to change password and they have to verify their old password first.
  VerifyPassword(adminNum: string, oldPassword: string) {
    let url = "https://qrapi0.herokuapp.com/VerifyPassword";
    let postParam = JSON.stringify({
      AdminNumber: adminNum,
      Password: oldPassword
    });

    return this.CallPost(url, postParam);
  }

  //Called when student wants to change password
  UpdatePassword(adminNum: string, password: string) {

    let url = "https://qrapi0.herokuapp.com/UpdatePassword";
    let postParam = JSON.stringify({
      AdminNumber: adminNum,
      Password: password
    });

    return this.CallPut(url, postParam);
  }

  //Called when student changes device -> UUID
  OverwriteDevice(adminNum: string, newUUID: string, inputPassword: string) {
    let url = "https://qrapi0.herokuapp.com/OverwriteDevice";
    let postParam = JSON.stringify({
      AdminNumber: adminNum,
      InputPassword: inputPassword,
      UUID: newUUID
    });

    return this.CallPost(url, postParam);
  }

  //Called when student use QRScanner to take attendance for a lesson
  TakeAttendance(AdminNumber: string, LessonQRText: string) {
    let url = "https://qrapi0.herokuapp.com/TakeAttendance";
    let postParam = JSON.stringify({
      AdminNumber: AdminNumber,
      LessonQRText: LessonQRText
    });

    return this.CallPut(url, postParam);
  }

  //Called to show all the lessons that student has attended for that semester or yet to attend on that day
  //Shows only lessons on that day and before.
  GetLessonAttendanceByStudent(AdminNumber: string) {
    let url = "https://qrapi0.herokuapp.com/LessonAttendanceByStudent";
    let postParam = JSON.stringify({
      AdminNumber: AdminNumber
    });

    return this.CallPost(url, postParam);
  }

  //Gets all the lessons for the day that the student has yet to attend.
  GetLessonForTheDay(AdminNumber: string) {
    let url = "https://qrapi0.herokuapp.com/LessonForTheDay";
    let postParam = JSON.stringify({
      AdminNumber: AdminNumber
    });

    return this.CallPost(url, postParam);
  }

  //Gets the location settings info to see if using location feature to take attendance is enabled, and get all the coordinates.
  GetLocationSetting() {
    let url = "https://qrapi0.herokuapp.com/LocationSettings";
    return this.CallGet(url);
  }

  //Gets the settings info on the total number of times allowed for a student to register account on new devices per sem
  GetChangeDeviceSettings() {
    let url = "https://qrapi0.herokuapp.com/ChangeDeviceSettings";
    return this.CallGet(url);
  }



  //for the follow three http request methods
  //if need to include timeout period
  //add '.pipe(timeout(10000))' after .get() & before .subscribe()
  //where 10000(10 seconds) being the duration
  //if timeout condition is added. need to catch the error and make response to users accordingly
  //refer to 'SendEmailToStudents' method. 
  CallGet(url: string) {
    return new Promise(resolve => {
      this.http.get(url, this.httpOptions).subscribe((data) => {
        this.getResult = data;
        resolve(this.getResult);
      });
    });
  }

  CallPost(url: string, postParam: any) {
    return new Promise(resolve => {
      this.http.post(url, postParam, this.httpOptions).subscribe((data) => {
        this.getResult = data;
        resolve(this.getResult);
      });
    });
  }

  CallPut(url: string, postParam: any) {
    return new Promise(resolve => {
      this.http.put(url, postParam, this.httpOptions).subscribe((data) => {
        this.getResult = data;
        resolve(this.getResult);
      });
    });
  }



  //School Email API--------------
  SendEmailToStudents(studentEmail:string, verifCode:string){
    //this is NYP email. Need to connect to nyp wifi in order to use
    //have not tested yet. If need to use this, still need to improve on it. Maybe need to change to /GET
    //var url="http://imhere2016.sit.nyp.edu.sg/EmailService/emailservice.asmx/SendMail";
    // let postParam=JSON.stringify({
    //   strToAddress:studentEmail,
    //   strFromAddress:"dsit@nyp.edu.sg",
    //   strFromName:"DSIT",
    //   strSubject:"Attendance App Verification Code",
    //   strMessage:verifCode
    // })


    //use this web service to send verification code.
    //this web service is created with Mr Gilbert Chan's personal account
    //and this webservice has to call using /GET. /Post does not work.
    var url =`http://gservice.g-cloud.co/GService.asmx/SendVerificationCode?strToEmail=${studentEmail}&strBody=${verifCode}`;

    return new Promise((resolve,reject) => {
      this.http.get(url).pipe(timeout(30000)).subscribe((data) => {
      //returns 'Send - Success' if email sent
      //returns 'Send - Fail' if email sent failed.
        this.getResult = data;
        resolve(this.getResult);
      },
      error=>{
        reject(error);
      });
    });
  }


  //Third Party Apis From Here ------------------------------------------------------------------------------------
  //Third Party Apis From Here ------------------------------------------------------------------------------------
  //Third Party Apis From Here ------------------------------------------------------------------------------------
  //Third Party Apis From Here ------------------------------------------------------------------------------------
  //Third Party Apis From Here ------------------------------------------------------------------------------------
  //Third Party Apis From Here ------------------------------------------------------------------------------------

  GetTypeFitRandomQuote() {
    var url = 'https://type.fit/api/quotes';

    return new Promise(resolve => {
      this.http.get(url).pipe(timeout(5000)).subscribe((data) => {
        this.results = data;
        var randomIndex = Math.floor(Math.random() * Math.floor(this.results.length));
        var result = this.results[randomIndex];
        resolve(result);
      },
        (error) => {
          resolve(null);
        })
    })
  }

  GetQODRandomQuote() {
    var url = 'https://quotes.rest/qod';
    return new Promise(resolve => {
      this.http.get(url).pipe(timeout(5000)).subscribe((data) => {
        this.getResult = data;
        resolve(this.getResult);
      },
        (error) => {
          resolve(null);
        })
    })
  }

}
