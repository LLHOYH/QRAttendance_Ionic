import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPasswordPage } from './register-password.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPasswordPageRoutingModule {}
