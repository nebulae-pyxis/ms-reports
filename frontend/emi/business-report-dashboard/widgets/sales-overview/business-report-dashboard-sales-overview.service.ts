import gql from "graphql-tag";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { GatewayService } from '../../../../../api/gateway.service';
import {
  businessReportDashboardSalesOverview
} from './gql/business-report-dashboard-sales-overview';
import { of } from 'rxjs';

@Injectable()
export class BusinessReportDashboardSalesOverviewService {

  constructor(private gateway: GatewayService) {
  }

  businessReportDashboardSalesOverview$(businessId) {
    return this.gateway.apollo
      .query<any>({
        query: gql`
        query{
          businessReportDashboardSalesOverview(businessId:"${businessId}"){
            timespan,
            datasets{
              timespan,
              scale,
              labels,
              datasets{
                mainSales,bonusSales,creditSales,mainBalance,bonusBalance,salesQty,bonusQty
              }
              
            }
          }
        }
        `,        
        fetchPolicy: 'network-only'
      })
      .map(resp => resp.data.businessReportDashboardSalesOverview);
  }

}
