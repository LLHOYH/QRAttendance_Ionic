import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private storage:Storage) { }

  //Admin Number. Stored when login. Used for other pages.
  SetAdminNumber(adminNumber:string){
    this.storage.set("AdminNumber",adminNumber);
  }

  GetAdminNumber(){
    return new Promise(resolve =>{
      this.storage.get("AdminNumber").then((val)=>{
        resolve(val);
      })
    })
  }

  RemoveAdminNumber(){
    this.storage.remove("AdminNumber");
  }

  //Token. Stored when login or register. Used for app's next launch auto login.
  SetToken(token:string){
    this.storage.set("AccountToken", token);
  }

  GetToken(){
    return new Promise(resolve =>{
      this.storage.get("AccountToken").then((val)=>{
        resolve(val);
      })
    })
  }

  RemoveToken(){
    this.storage.remove("AccountToken");
  }

  //Profile Icon Path.
  SetProfileIcon(profileIcon){
    this.storage.set("ProfileIcon", profileIcon);
  }

  GetProfileIcon(){
    return new Promise(resolve =>{
      this.storage.get("ProfileIcon").then((val)=>{
        resolve(val);
      })
    })
  }

}
