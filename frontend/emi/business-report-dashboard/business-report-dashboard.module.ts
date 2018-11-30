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

import { BusinessReportDashboardWalletStatusCardsComponent } from './widgets/wallet-status-cards/business-report-dashboard-wallet-status-cards.component';
import { BusinessReportDashboardWalletStatusCardsService } from './widgets/wallet-status-cards/business-report-dashboard-wallet-status-cards.service';

import { BusinessReportDashboardSalesOverviewComponent } from './widgets/sales-overview/business-report-dashboard-sales-overview.component';
import { BusinessReportDashboardSalesOverviewService } from './widgets/sales-overview/business-report-dashboard-sales-overview.service';

import { BusinessReportDashboardNetSalesDistributionComponent } from './widgets/net-sales-distribution/business-report-dashboard-net-sales-distribution.component';
import { BusinessReportDashboardNetSalesDistributionService } from './widgets/net-sales-distribution/business-report-dashboard-net-sales-distribution.service';

import { BusinessReportDashboardNetBonusDistributionComponent } from './widgets/net-bonus-distribution/business-report-dashboard-net-bonus-distribution.component';
import { BusinessReportDashboardNetBonusDistributionService } from './widgets/net-bonus-distribution/business-report-dashboard-net-bonus-distribution.service';

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
    BusinessReportDashboardBonusLineChartComponent,
    BusinessReportDashboardWalletStatusCardsComponent,
    BusinessReportDashboardSalesOverviewComponent,
    BusinessReportDashboardNetSalesDistributionComponent,
    BusinessReportDashboardNetBonusDistributionComponent,
  ],
  providers: [
    DatePipe,
    BusinessReportDashboardService,
    BusinessReportDashboardBonusLineChartService,
    BusinessReportDashboardWalletStatusCardsService,
    BusinessReportDashboardSalesOverviewService,
    BusinessReportDashboardNetSalesDistributionService,
    BusinessReportDashboardNetBonusDistributionService
  ]
})
export class BusinessReportDashboardModule { };