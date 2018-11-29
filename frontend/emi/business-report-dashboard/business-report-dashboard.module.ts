import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { DatePipe } from '@angular/common';
import { FuseWidgetModule } from '../../../core/components/widget/widget.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BusinessReportDashboardService } from './business-report-dashboard.service';
import { BusinessReportDashboardComponent } from './business-report-dashboard.component';
import { BusinessReportDashboardBonusLineChartComponent } from './widgets/bonus-line-chart/business-report-dashboard-bonus-line-chart.component';
import { BusinessReportDashboardBonusLineChartService } from './widgets/bonus-line-chart/business-report-dashboard-bonus-line-chart.service';

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
    FuseWidgetModule,
    NgxChartsModule,
  ],
  declarations: [
    BusinessReportDashboardComponent,
    BusinessReportDashboardBonusLineChartComponent
  ],
  providers: [ BusinessReportDashboardService, BusinessReportDashboardBonusLineChartService,DatePipe]
})
export class BusinessReportDashboardModule{};