import { Component, OnInit } from '@angular/core';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallingService } from 'src/services/api-calling.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { PageElementsService } from 'src/services/page-elements.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone'

declare var google;

@Component({
  selector: 'app-qrhome',
  templateUrl: './qrhome.page.html',
  styleUrls: ['./qrhome.page.scss'],
})

export class QRHomePage implements OnInit {

  adminNum: any;
  lessonInfo: any;
  loading: any;
  scanSub: any;
  scannerClass: any;
  navigateFrom: any;
  attenTakingResult: any;
  scannedMsg: string;
  result: any;
  studentDetail: any;
  studentName: string;
  profileImgPath: any;

  QODResult: any; //quote of the day api
  TFQResult: any; //type.fit quote api
  quoteText: string;
  quoteAuthor: string;
  quoteLoaded: boolean = false;

  lessonResults: any;
  lesson: any;
  lessonReplaceText: string;
  lessonSectionTitle: string;
  lessonLoaded: boolean = false;

  lessonRefreshing: boolean = false;

  allLoaded: boolean = false;

  lat: any;
  long: any;

  schDistance;
  fieldDistance;
  distanceValid: any = false;

  locSettingResult: any;
  locResult: any;
  locationEnabled: boolean = false;
  includeField: boolean = false;


  constructor(public platforms: Platform,
    public toast: ToastController, public http: HttpClient, private alertCtrl: AlertController,
    private router: Router, private acRoute: ActivatedRoute, private geoLoc: Geolocation,
    private apiSvc: ApiCallingService, private storageSvc: LocalStorageService, private qrScanner: QRScanner,
    private pageSvc: PageElementsService, private datePipe: DatePipe) {

  }


  //at the start, load all 3 sections:
  //  - profile section
  //  - lesson section
  //  - quote section
  async ngOnInit() {

    await this.storageSvc.GetAdminNumber().then(async (adminNum)=>{
      
      this.adminNum=adminNum;
      //set name (profile)
      if (this.adminNum != null) {
        this.result = await this.apiSvc.GetStudentByAdminNumber(this.adminNum);
        if (this.result.Error_Message == null && this.result.StudentInfo != null) {
          this.studentDetail = this.result.StudentInfo[0];
          this.studentName = this.studentDetail.FullName;
        }
        else if (this.result.Error_Message != null) {
          this.pageSvc.PresentToastWithIcon(false, this.result.Error_Message);
        }
      }

      //varify all component's loading status. If all loaded, remove skeleton text.
      this.SetLoadedStatus();

      //set next lesson
      await this.GetNextLesson();

      //set quote
      await this.GetQuote();

      //set location setting
      await this.SetLocationSettings();
    })


  }

  async ionViewWillEnter() {

    //set profile icon
    this.profileImgPath = await this.storageSvc.GetProfileIcon();
    if (this.profileImgPath == null) {
      this.profileImgPath = '../assets/ProfileImgs/male1.png';
    }

    //if after using scanner to take attendance, take the result returned.
    this.navigateFrom = this.acRoute.snapshot.paramMap.get("navigateFrom");
    if (this.navigateFrom == "Page_Scanner") {
      this.TakeAttendance();
    }

  }

  //Prepare for the Lesson Section
  async GetNextLesson() {

    this.lessonLoaded = false;
    this.lessonResults = await this.apiSvc.GetLessonForTheDay(this.adminNum);

    if (this.lessonResults.Success && this.lessonResults.Lesson_Results.length > 0) {
      this.lesson = this.lessonResults.Lesson_Results[0];
      this.lesson.LessonTime = moment(this.lesson.LessonTime, "HH:mm").format("hh:mma");
      this.lessonReplaceText = null;

      var currentTime = moment(this.datePipe.transform(new Date(), 'HH:mm'), 'HH:mm');
      var lessonTime = moment(this.lesson.LessonTime, "HH:mm");

      if (currentTime.isAfter(lessonTime)) {
        this.lessonSectionTitle = "Lesson In Progress..."
      }
      else {
        this.lessonSectionTitle = "Be Ready For Upcoming Lesson..."
      }

    }
    else if (!this.lessonResults.Success && this.lessonResults.Error_Message == null) {
      this.lessonReplaceText = "No More Lessons Found For The Day!";
    }
    else if (this.lessonResults.Success && this.lessonResults.Error_Message != null) {
      this.lessonReplaceText = "Failed To Get Lesson For The Day!";
    }
    this.lessonLoaded = true;
    this.SetLoadedStatus();

  }

  //Prepare for the Quote Section
  async GetQuote() {

    this.quoteLoaded = false;
    //using two quotes api here, just in case if one fails...

    this.QODResult = await this.apiSvc.GetQODRandomQuote(); //get quote from QOD api first

    if (this.QODResult != null) {
      this.quoteText = this.QODResult.contents.quotes[0].quote;
      this.quoteAuthor = this.QODResult.contents.quotes[0].author;
    }
    else {
      this.TFQResult = await this.apiSvc.GetTypeFitRandomQuote(); //if previous api has no quote, try new one
      if (this.TFQResult != null) {
        this.quoteText = this.TFQResult.text;
        this.quoteAuthor = this.TFQResult.author;
      }
    }

    if (this.quoteText == null || this.quoteAuthor == null) {   //if still no quote, use default..
      this.quoteText = "Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week in the woods. Wash your spirit clean."
      this.quoteAuthor = "John Muir";
    }

    this.quoteLoaded = true;

    this.SetLoadedStatus();

  }

  //calling api to get location settings, on page load.
  async SetLocationSettings() {
    this.locSettingResult = await this.apiSvc.GetLocationSetting();
    this.locationEnabled = false;
    this.includeField = false;

    if (this.locSettingResult.Success) {
      this.locResult = this.locSettingResult.Setting_Results;

      if (this.locResult.LocationEnabled == 1) {
        this.locationEnabled = true;

        if (this.locResult.IncludeField == 1)
          this.includeField = true;
      }
    }
  }

  //use geolocation to get the location of user.
  async GetLocation() {
    return new Promise((resolve) => {
      this.platforms.ready().then(() => {
        this.geoLoc.getCurrentPosition().then((resp) => {
          this.lat = resp.coords.latitude;
          this.long = resp.coords.longitude;

          //calculate distance using the 2 sets of coordinates:
          //  - school's location coordinates
          //  - student's location coordinates
          this.schDistance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.locResult.NYPSchoolLat, this.locResult.NYPSchoolLong), new google.maps.LatLng(this.lat, this.long));
          if (this.schDistance <= this.locResult.SchoolRadiusInMetres) {
            this.distanceValid = true;
          }
          else if (this.includeField) {
            this.fieldDistance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.locResult.NYPFieldLat, this.locResult.NYPFieldLong), new google.maps.LatLng(this.lat, this.long));

            if (this.fieldDistance <= this.locResult.FieldRadiusInMetres) {
              this.distanceValid = true;
            }
            else {
              this.pageSvc.PresentAlertWithOk("Location Invalid", null, "Please Ensure You Are In The Campus!");
              this.distanceValid = false;
            }
          }
          else {
            this.pageSvc.PresentAlertWithOk("Location Invalid", null, "Please Ensure You Are In The Campus!");
          }
          resolve(this.distanceValid);
        }).catch((error) => {
          this.pageSvc.PresentAlert("An Error Has Occured", null, "Please Ensure You Have Allow the Permission To Access Location!");
          resolve(false);
        });
      })
    })


  }

  //when student redirects back from scanner page, take the attendance.
  //scanner page will redirect to this page with a msg (QRText)
  //verify is the QRText is valid (has a 'Source' of 'NYP_LESSONS', [statically set in asp.net])
  async TakeAttendance() {
    this.scannedMsg = this.acRoute.snapshot.paramMap.get("scannedMsg");

    if (this.scannedMsg != null) {
      let msgInJson = JSON.parse(this.scannedMsg);
      if (msgInJson.Source == "NYP_LESSONS") {
        this.pageSvc.PresentSpinner('Taking Attendance...');

        //take attendance through api
        this.attenTakingResult = await this.apiSvc.TakeAttendance(this.adminNum, msgInJson.QRText);

        if (this.attenTakingResult.Success) {
          this.pageSvc.PresentToastWithIcon(true, "Attendance Successfully Taken");
        } else {
          this.pageSvc.PresentToastWithIcon(false, this.attenTakingResult.Error_Message);
        }
        this.pageSvc.DismissSpinner();
      }
      else {

        this.pageSvc.PresentToastWithIcon(false, "Invalid QR Code!");
      }
    } else {
      this.pageSvc.PresentToastWithIcon(false, "No Lesson Captured. Please Try Again!");
    }
  }

  //Scanner-Image Clicked
  async TestScannerAvailability() {

    //test if scanner function is available
    //if yes, redirect to scanner page to scan
    this.platforms.ready().then(async () => {
      console.log(this.locationEnabled);

      //only if the location function is enabled, then will use this function.
      if (this.locationEnabled) {
        this.distanceValid = await this.GetLocation();
      }

      if (!this.locationEnabled || (this.locationEnabled && this.distanceValid)) {
        this.qrScanner.prepare()
          .then((status: QRScannerStatus) => {
            if (status.authorized) { //if authorized, redirect to scanner page to carry out scanning. here will check for all kinds of errors first.
              this.router.navigate(["/tabs/scanner"], { replaceUrl: true });
            } else if (status.denied) { // guide the user to the settings page
              this.PresentAlertConfirm("Permission Not Granted?", "You need to grant camera permission in order to open QR Scanner.", "Go To Settings");
            } else {
              this.PresentAlertConfirm("Permission Not Granted?", "You need to grant camera permission in order to open QR Scanner.", "Go To Settings");
            }
          })
          .catch((e: any) => {
            if (e.name == "CAMERA_ACCESS_DENIED") {
              this.PresentAlertConfirm("Permission Not Granted?", "You need to grant camera permission in order to open QR Scanner.", "Go To Settings");
            }
            else {
              this.pageSvc.PresentAlert("Error Occurs", null, JSON.stringify(e));
            }
          })
      }

    });
  }

  //set loadedstatus, triggers after lessonloaded, quoteloaded and names loaded. If all loaded, then remove skeleton text.
  async SetLoadedStatus() {
    if (this.lessonLoaded && this.quoteLoaded && this.studentName != null) {
      this.allLoaded = true;
    }
  }

  //Refresh-Spinner-Icon Clicked
  async RefreshLesson(ev?) {
    this.lessonRefreshing = true;

    this.GetNextLesson().then(() => {
      this.lessonRefreshing = false;
    })

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
            this.qrScanner.openSettings();
          }
        }
      ]
    });

    await alert.present();
  }

}
