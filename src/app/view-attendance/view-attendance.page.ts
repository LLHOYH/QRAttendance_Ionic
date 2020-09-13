import { Component, OnInit } from '@angular/core';
import { ApiCallingService } from 'src/services/api-calling.service';
import { PageElementsService } from 'src/services/page-elements.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import * as moment from 'moment-timezone'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.page.html',
  styleUrls: ['./view-attendance.page.scss'],
})
export class ViewAttendancePage implements OnInit {

  adminNumber: any;
  lessonResults: any;
  result: any;
  lessonDates: any[];

  //vm refers to viewmodel
  //this project only uses a viewattendance-viewmodel
  //which contains all the properties needed to display attendance record
  //  - 'vms' collects all attendance records of that student in the semester before current date from api.
  //  - 'displayvms' are the attendance records that are displayed on html
  vms: ViewAttendanceViewModel[];
  displayVms: ViewAttendanceViewModel[];


  lessonTimeMargin: number = 10;
  momentLessonDates: string[];
  momentLessonDateIndex: number = 0;
  displayLessonDate: string;

  loadFull: boolean = false;
  skeletonTextGlobal: boolean = true;

  constructor(private apiSvc: ApiCallingService, private pageSvc: PageElementsService, private storageSvc: LocalStorageService,
    private datePipe: DatePipe) {

  }

  ngOnInit() {
  }

  //after page is init..
  //start skeleton text timer
  //disable skeleton text after 5 seconds
  async ngAfterViewInit() {
    this.SkeletonTextTimer();
  }

  async ionViewWillEnter() {
    await this.storageSvc.GetAdminNumber().then((adminNumber) => {
      this.adminNumber = adminNumber;
      if (this.adminNumber != null)
        this.GetLessonAttendance();
    });

  }

  //get students' attendance until current date. 
  async GetLessonAttendance() {
    this.loadFull = false;
    var getStatus = false;
    this.vms = []; //first, set vms to nothing.
    this.momentLessonDateIndex = 0;

    this.result = await this.apiSvc.GetLessonAttendanceByStudent(this.adminNumber);

    if (this.result.Success) {
      this.vms = this.result.LessonResults;// filled vms with all attendance records of student

      if (this.vms != null) {
        this.SetDisplayLessonDate();
        var constructingVms = await this.FilterDisplayVMs(this.displayLessonDate);

        this.displayVms = [];
        if (constructingVms != null) {
          this.MergeVMs(constructingVms);
          getStatus = true;
        }
      }
    }
    else {
      this.pageSvc.PresentToast(this.result.Error_Message);
    }

    return getStatus;
  }

  //loop through vms and see how many days of attendance record can we break the vms into.
  async SetDisplayLessonDate() {
    if (this.momentLessonDates == null && this.momentLessonDateIndex == 0) {
      this.momentLessonDates = [];
      for (var i = 0; i < this.vms.length; i++) {
        if (i == 0 || (i != 0 && this.vms[i - 1].LessonDate != this.vms[i].LessonDate)) {
          this.momentLessonDates.push(this.vms[i].LessonDate);
        }
      }
    }
    this.displayLessonDate = this.datePipe.transform(new Date(this.momentLessonDates[this.momentLessonDateIndex]), 'dd/MM/yyyy');
    this.momentLessonDateIndex++;
  }

  //get the attendance record of specified date (pass in parameter), from vms
  async FilterDisplayVMs(displayLessonDate) {
    var constructingVms = this.vms.filter((vm) => this.datePipe.transform(new Date(vm.LessonDate), 'dd/MM/yyyy') == displayLessonDate);
    return constructingVms;
  }

  async ReconstructVMs(constructingVms: ViewAttendanceViewModel[]) {

    var currentTime = moment(this.datePipe.transform(new Date(), 'HH:mm'), 'HH:mm');
    var today = this.datePipe.transform(new Date(), 'dd/MM/yyyy');


    for (var i = 0; i < constructingVms.length; i++) {

      //first, convert status from tinyint to bool
      // so that it is easier for future developer to understand

      if (constructingVms[i].AttendanceStatus == 0) {
        constructingVms[i].AttendanceStatusBool = false;
      }
      else if (constructingVms[i].AttendanceStatus == 1) {
        constructingVms[i].AttendanceStatusBool = true;
      }

      //follow by format the lesson time
      constructingVms[i].LessonTime = moment(constructingVms[i].LessonTime, "HH:mm").format("hh:mma");
      constructingVms[i].DisplayDate = this.datePipe.transform(new Date(constructingVms[i].LessonDate), 'dd/MM/yyyy');

      //set the display date / day title
      if (i == 0) {
        var formattedDate = this.datePipe.transform(new Date(constructingVms[i].LessonDate), 'dd/MM/yyyy');
        var yesterday = this.datePipe.transform(new Date().setDate(new Date().getDate() - 1), 'dd/MM/yyyy');
        if (formattedDate == today)
          constructingVms[i].DisplayDay = 'Today'
        else if (formattedDate == yesterday)
          constructingVms[i].DisplayDay = 'Yesterday';
        else {
          constructingVms[i].DisplayDay = this.datePipe.transform(new Date(constructingVms[i].LessonDate), 'EEEE');
        }

        constructingVms[i].DisplayDateTitle = true;
      }


      //set the display attendance status
      if (constructingVms[i].LessonType != 'FYPJ') {

        //lesson buffer time is lesson starting time plus 10 minutes.
        var lessonBufferTime = moment(constructingVms[i].LessonTime, "HH:mm").add(this.lessonTimeMargin, "minutes");

        //attendance marked
        //present - green border
        if (constructingVms[i].AttendanceStatusBool && constructingVms[i].ClockInTime != null) {
          constructingVms[i].DisplayClockIn = moment(constructingVms[i].ClockInTime, "HH:mm").format("hh:mma");
          constructingVms[i].BorderClass = "presentBorder";
          constructingVms[i].TextClass = "presentText";
        }
        //attendance not marked and current time is later than lesson's buffer time.
        //absent - red border
        else if (currentTime.isAfter(lessonBufferTime) && !constructingVms[i].AttendanceStatusBool) {
          constructingVms[i].DisplayClockIn = "Absent";
          constructingVms[i].BorderClass = "absentBorder";
          constructingVms[i].TextClass = "absentText";
        }
        //anything else (lesson not started yet)
        //no activity - gray border
        else {
          constructingVms[i].DisplayClockIn = null;
          constructingVms[i].BorderClass = "noActivityBorder";
          constructingVms[i].TextClass = "noActivityText";
        }
      }
      else {  //section specially for fypj

        var currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        var lessonDate = this.datePipe.transform(new Date(constructingVms[i].LessonDate), 'yyyy-MM-dd');

        //attendance marked, clocked in and out.
        //present - green border
        if (constructingVms[i].AttendanceStatusBool && constructingVms[i].ClockInTime != null && constructingVms[i].ClockOutTime != null) {
          constructingVms[i].DisplayClockIn = moment(constructingVms[i].ClockInTime, "HH:mm").format("hh:mma");
          constructingVms[i].DisplayClockOut = moment(constructingVms[i].ClockOutTime, "HH:mm").format("hh:mma");
          constructingVms[i].BorderClass = "presentBorder";
          constructingVms[i].TextClass = "presentText";
        }
        //on that day of lesson, attendance marked, clocked in and but yet to clocked out.
        //waiting - yellow border
        else if (moment(currentDate).isSame(lessonDate, 'day') && constructingVms[i].AttendanceStatusBool && constructingVms[i].ClockInTime != null && constructingVms[i].ClockOutTime == null) {
          constructingVms[i].DisplayClockIn = moment(constructingVms[i].ClockInTime, "HH:mm").format("hh:mma");
          constructingVms[i].DisplayClockOut = null;
          constructingVms[i].BorderClass = "waitingBorder";
          constructingVms[i].TextClass = "waitingText";
        }
        //after that day of lesson, attendance not marked
        //absent - red border
        else if (moment(currentDate).isAfter(lessonDate, 'day') && (!constructingVms[i].AttendanceStatusBool || constructingVms[i].ClockInTime == null || constructingVms[i].ClockOutTime == null)) {
          constructingVms[i].DisplayClockIn = "Absent";
          constructingVms[i].DisplayClockOut = null;
          constructingVms[i].BorderClass = "absentBorder";
          constructingVms[i].TextClass = "absentText";
        }
        //anything else (lesson not started yet)
        //no activity - gray border
        else {
          constructingVms[i].DisplayClockIn = null;
          constructingVms[i].DisplayClockOut = null;
          constructingVms[i].BorderClass = "noActivityBorder";
          constructingVms[i].TextClass = "noActivityText";
        }
      }

    }

    return constructingVms;
  }

  //Combine currently displaying attendance record with previous day's attendance record
  //Used when student scrolls the page.
  async MergeVMs(constructingVms: ViewAttendanceViewModel[]) {
    if (constructingVms.length != 0) {
      constructingVms = await this.ReconstructVMs(constructingVms);

      if (this.displayVms == null)  //if it is first call of the method, where page has nothing, just use =
        this.displayVms = constructingVms;
      else {
        constructingVms.forEach(vm => { //if display vms already has data, need to loop through and one by one add
          this.displayVms.push(vm);
        })
      }
    }
  }

  //Refresh-Element Pulled
  async RefreshLessons(event?: any) {
    await this.GetLessonAttendance();
    event.target.complete();
  }

  //Infinite-Scrolling Scrolled
  async LoadMoreLessons(event?: any) {

    setTimeout(async () => {
      if (this.momentLessonDateIndex <= this.momentLessonDates.length - 1) { //still have attendance record to load
        var canLoad = this.SetDisplayLessonDate();
        if (canLoad) {
          var constructingVms = await this.FilterDisplayVMs(this.displayLessonDate);
          if (constructingVms != null) {
            this.MergeVMs(constructingVms);
          }
        }
      }
      else { //no more attendance record to load
        this.loadFull = true;
      }
      event.target.complete();
    }, 500);
  }

  //this method ensures after 5 seconds into the page, even if no data is capture, the skeleton text will disappear
  async SkeletonTextTimer() {
    setTimeout(() => {
      this.skeletonTextGlobal = false;
    }, 5000);
  }



}
