import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPasswordPageRoutingModule } from './register-password-routing.module';

import { RegisterPasswordPage } from './register-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPasswordPageRoutingModule,
    ReactiveFormsModule

  ],
  declarations: [RegisterPasswordPage]
})
export class RegisterPasswordPageModule {}
