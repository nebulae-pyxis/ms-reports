import gql from "graphql-tag";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { GatewayService } from '../../../../../api/gateway.service';
import {
  businessReportDashboardBonusLineChart
} from './gql/business-report-dashboard-bonus-line-chart';
import { of } from 'rxjs';

@Injectable()
export class BusinessReportDashboardBonusLineChartService {

  constructor(private gateway: GatewayService) {
  }

  businessReportDashboardBonusLineChart$(businessId) {
    return this.gateway.apollo
      .query<any>({
        query: gql`
                query{
                    businessReportDashboardBonusLineChart(  businessId: "${businessId}"){
                            timespan,scale,order,labels,datasets{order,label,data}
                }
            }
        `,
        fetchPolicy: 'network-only',
      })
      .map(resp => resp.data.businessReportDashboardBonusLineChart);
  }

}
