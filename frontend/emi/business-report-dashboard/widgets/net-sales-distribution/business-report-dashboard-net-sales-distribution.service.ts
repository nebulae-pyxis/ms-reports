import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { GatewayService } from '../../../../../api/gateway.service';
import {
  businessReportDashboardNetSalesDistribution
} from './gql/business-report-dashboard-net-sales-distribution';
import { of } from 'rxjs';

@Injectable()
export class BusinessReportDashboardNetSalesDistributionService {

  constructor(private gateway: GatewayService) {
  }

  businessReportDashboardNetSalesDistribution$(businessId) {
    return this.gateway.apollo
      .query<any>({
        query: businessReportDashboardNetSalesDistribution,        
        fetchPolicy: 'network-only'
      })
      .map(resp => resp.data.businessReportDashboardNetSalesDistribution);
  }
}
