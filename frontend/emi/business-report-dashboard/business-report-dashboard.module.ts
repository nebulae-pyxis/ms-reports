import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { DatePipe } from '@angular/common';
import { FuseWidgetModule } from '../../../core/components/widget/widget.module';

import { BusinessReportDashboardService } from './business-report-dashboard.service';
import { BusinessReportDashboardComponent } from './business-report-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessReportDashboardComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseWidgetModule
  ],
  declarations: [
    BusinessReportDashboardComponent    
  ],
  providers: [ BusinessReportDashboardService, DatePipe]
})

export class BusinessReportDashboardModule{};