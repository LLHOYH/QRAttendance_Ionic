import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterAdminNumberPage } from './register-admin-number.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterAdminNumberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAdminNumberPageRoutingModule {}
