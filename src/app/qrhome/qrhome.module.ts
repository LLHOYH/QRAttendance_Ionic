import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QRHomePageRoutingModule } from './qrhome-routing.module';

import { QRHomePage } from './qrhome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRHomePageRoutingModule,

  ],
  declarations: [QRHomePage]
})
export class QRHomePageModule {}
