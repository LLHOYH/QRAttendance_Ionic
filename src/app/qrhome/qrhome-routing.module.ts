import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QRHomePage } from './qrhome.page';

const routes: Routes = [
  {
    path: '',
    component: QRHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QRHomePageRoutingModule {}
