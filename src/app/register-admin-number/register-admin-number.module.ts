import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterAdminNumberPageRoutingModule } from './register-admin-number-routing.module';

import { RegisterAdminNumberPage } from './register-admin-number.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterAdminNumberPageRoutingModule
  ],
  declarations: [RegisterAdminNumberPage]
})
export class RegisterAdminnumberPageModule {}
