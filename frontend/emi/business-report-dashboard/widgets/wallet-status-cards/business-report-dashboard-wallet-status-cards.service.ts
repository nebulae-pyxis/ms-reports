import gql from "graphql-tag";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { GatewayService } from '../../../../../api/gateway.service';
import {
  businessReportDashboardWalletStatusCards
} from './gql/business-report-dashboard-wallet-status-cards';
import { of } from 'rxjs';

@Injectable()
export class BusinessReportDashboardWalletStatusCardsService {

  constructor(private gateway: GatewayService) {
  }

  businessReportDashboardWalletStatusCards$(businessId) {
    return this.gateway.apollo
      .query<any>({
        query: gql`
        query{
          businessReportDashboardWalletStatusCards(businessId:"${businessId}"){
            spendingAllowed,
            pockets{
              order,name,balance,lastUpdate,currency
            }
          }
        }
        `,        
        fetchPolicy: 'network-only'
      })
      .map(resp => resp.data.businessReportDashboardWalletStatusCards);
  }

}
