import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-select-icon-popover',
  templateUrl: './select-icon-popover.page.html',
  styleUrls: ['./select-icon-popover.page.scss'],
})
export class SelectIconPopoverPage implements OnInit {

  imgOpacity:number=1;
  imgFilter:any;
  wrapperBG:string;
  selectedImgPath:string;


  //Just a popoverpage for selecting of profile Icon.
  constructor(private storageSvc:LocalStorageService, private popoverCtrl:PopoverController) { }

  ngOnInit() {
  }

  //Any-Profile-Icon Clicked
  async SetSelectedIcon(event?){

    var id = event.target.id;

    var ele = document.getElementsByClassName('profileIcons');
    for(var i =0 ;i<ele.length;i++){
      ele[i].classList.remove('selected');
    }

    //class 'selected' has css pre-set.
    document.getElementById(id).classList.add("selected");
    
    var img= document.getElementById(id) as HTMLImageElement;
    this.selectedImgPath=img.src;
  }

  //Done-Button Clicked
  async Done(){
    if(this.selectedImgPath!=null){
      this.storageSvc.SetProfileIcon(this.selectedImgPath);
    }
    await this.popoverCtrl.dismiss();
  }

}
