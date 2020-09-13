import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectIconPopoverPage } from './select-icon-popover.page';

const routes: Routes = [
  {
    path: '',
    component: SelectIconPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectIconPopoverPageRoutingModule {}
