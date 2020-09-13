import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register-admin-number',
    loadChildren: () => import('./register-admin-number/register-admin-number.module').then( m => m.RegisterAdminnumberPageModule)
  },
  {
    path: 'register-password',
    loadChildren: () => import('./register-password/register-password.module').then( m => m.RegisterPasswordPageModule)
  },
  {
    path: 'register-password/:AdminNumber',
    loadChildren: () => import('./register-password/register-password.module').then( m => m.RegisterPasswordPageModule)
  },
  {
    path: 'overwrite-device-password',
    loadChildren: () => import('./overwrite-device-password/overwrite-device-password.module').then( m => m.OverwriteDevicePasswordPageModule)
  },
  {
    path: 'overwrite-device-password/:AdminNumber',
    loadChildren: () => import('./overwrite-device-password/overwrite-device-password.module').then( m => m.OverwriteDevicePasswordPageModule)
 },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'reset-password/:AdminNumber',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'select-icon-popover',
    loadChildren: () => import('./select-icon-popover/select-icon-popover.module').then( m => m.SelectIconPopoverPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
