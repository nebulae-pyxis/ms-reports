import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { DatePipe } from '@angular/common';
import { FuseWidgetModule } from '../../../core/components/widget/widget.module';

import { ReportsService } from './pos-coverage-report.service';
import { PosCoverageReportComponent } from './pos-coverage-report.component';

const routes: Routes = [
  {
    path: '',
    component: PosCoverageReportComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseWidgetModule
  ],
  declarations: [
    PosCoverageReportComponent
  ],
  providers: [ ReportsService, DatePipe]
})

export class PosCoverageReportModule {}
