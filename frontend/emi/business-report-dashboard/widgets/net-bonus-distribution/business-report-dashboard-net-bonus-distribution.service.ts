import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { GatewayService } from '../../../../../api/gateway.service';
import {
  businessReportDashboardNetBonusDistribution
} from './gql/business-report-dashboard-net-bonus-distribution';
import { of } from 'rxjs';

@Injectable()
export class BusinessReportDashboardNetBonusDistributionService {

  constructor(private gateway: GatewayService) {
  }

  businessReportDashboardNetBonusDistribution$(businessId) {
    return this.gateway.apollo
      .query<any>({
        query: businessReportDashboardNetBonusDistribution,
        fetchPolicy: 'network-only'
      })
      .map(resp => resp.data.businessReportDashboardNetBonusDistribution);
  }

}
