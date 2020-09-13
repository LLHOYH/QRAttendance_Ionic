import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        pathMatch:'full',
        redirectTo:'qrhome'
      },
      {
        path: 'qrhome',
        loadChildren: () => import('../qrhome/qrhome.module').then(m => m.QRHomePageModule)
      },
      {
        path: 'qrhome/:navigateFrom/:scannedMsg',
        loadChildren: () => import('../qrhome/qrhome.module').then(m => m.QRHomePageModule)
      },
      {
        path: 'scanner',
        loadChildren: () => import('../scanner/scanner.module').then(m => m.ScannerPageModule)
      },
      {
        path: 'view-attendance',
        loadChildren: () => import('../view-attendance/view-attendance.module').then( m => m.ViewAttendancePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'change-password',
        loadChildren: () => import('../change-password/change-password.module').then( m => m.ChangePasswordPageModule)
      }
    ]
  },
  {
    path: '',
    pathMatch:'full',
    redirectTo:'qrhome'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
