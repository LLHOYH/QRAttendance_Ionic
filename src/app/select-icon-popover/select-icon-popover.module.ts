import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectIconPopoverPageRoutingModule } from './select-icon-popover-routing.module';

import { SelectIconPopoverPage } from './select-icon-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectIconPopoverPageRoutingModule
  ],
  declarations: [SelectIconPopoverPage]
})
export class SelectIconPopoverPageModule {}
