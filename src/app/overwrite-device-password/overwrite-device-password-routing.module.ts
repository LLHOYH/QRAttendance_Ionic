import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverwriteDevicePasswordPage } from './overwrite-device-password.page';

const routes: Routes = [
  {
    path: '',
    component: OverwriteDevicePasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverwriteDevicePasswordPageRoutingModule {}
