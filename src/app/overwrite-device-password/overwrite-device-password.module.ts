import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverwriteDevicePasswordPageRoutingModule } from './overwrite-device-password-routing.module';

import { OverwriteDevicePasswordPage } from './overwrite-device-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverwriteDevicePasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OverwriteDevicePasswordPage]
})
export class OverwriteDevicePasswordPageModule {}
