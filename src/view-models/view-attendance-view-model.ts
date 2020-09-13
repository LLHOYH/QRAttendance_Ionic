interface ViewAttendanceViewModel{
    ModuleCode?:string,
    ModuleName?:string,
    LessonID?:number,
    LessonDate?:string,
    LessonTime?:string,
    LessonVenue?:string,
    LessonType?:string,
    ScheduleID?:number,
    AttendanceStatus?:number,
    ClockInTime?:string,
    ClockOutTime?:string,

    DisplayDateTitle?:boolean,
    DisplayDay?:string,
    DisplayDate?:string,
    DisplayClockIn?:string,
    DisplayClockOut?:string
    AttendanceStatusBool?:boolean,
    BorderClass?:string,  //set css class of display attendance status
    TextClass?:string
}
