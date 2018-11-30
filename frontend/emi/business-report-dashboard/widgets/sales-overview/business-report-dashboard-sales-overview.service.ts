import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { GatewayService } from '../../../../../api/gateway.service';
import {
  
} from './gql/business-report-dashboard-sales-overview';
import { of } from 'rxjs';

@Injectable()
export class BusinessReportDashboardSalesOverviewService {

  constructor(private gateway: GatewayService) {
  }

}
