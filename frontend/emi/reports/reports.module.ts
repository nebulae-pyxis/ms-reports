import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { DatePipe } from '@angular/common';
import { FuseWidgetModule } from '../../../core/components/widget/widget.module';

import { reportsService } from './reports.service';
import { reportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: reportsComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseWidgetModule
  ],
  declarations: [
    reportsComponent    
  ],
  providers: [ reportsService, DatePipe]
})

export class reportsModule {}