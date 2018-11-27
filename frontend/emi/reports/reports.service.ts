import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { GatewayService } from '../../../api/gateway.service';
import {
  getBusinesses,
  getPosItems
} from './gql/reports';
import { of } from 'rxjs';

@Injectable()
export class reportsService {


  constructor(private gateway: GatewayService) {

  }

  getBusinessAndProducts$() {
    return this.gateway.apollo
      .query<any>({
        query: getBusinesses,
        fetchPolicy: 'network-only'
      })
      .map( resp => resp.data.ReportBusinesses);
  }
  /**
     [ { businessId: '123Nebula', businessName: 'Nebula', products: ['Recarga civica', 'venta pos'] },
       { businessId: '123Gana', businessName: 'Gana', products: ['Recarga', 'recarga minutos'] }
     ]
   */

  getPosItems$(businessId: string, product: string, posId: string) {
    return this.gateway.apollo
      .query<any>({
        query: getPosItems,
        fetchPolicy: 'network-only',
        variables: { businessId, product, posId }
      })
      .map( resp => resp.data.ReportPosItems);
  }

}
