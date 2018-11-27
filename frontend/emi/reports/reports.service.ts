import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';
import { GatewayService } from '../../../api/gateway.service';
import {
  getHelloWorld,
  reportsHelloWorldSubscription
} from './gql/reports';
import { of } from 'rxjs';

@Injectable()
export class reportsService {


  constructor(private gateway: GatewayService) {

  }

  /**
   * Hello World sample, please remove
   */
  getHelloWorld$() {
    return this.gateway.apollo
      .watchQuery<any>({
        query: getHelloWorld,
        fetchPolicy: 'network-only'
      })
      .valueChanges.map(
        resp => resp.data.getHelloWorldFromreports.sn
      );
  }

  /**
  * Hello World subscription sample, please remove
  */
 getEventSourcingMonitorHelloWorldSubscription$(): Observable<any> {
  return this.gateway.apollo
    .subscribe({
      query: reportsHelloWorldSubscription
    })
    .map(resp => resp.data.reportsHelloWorldSubscription.sn);
}

getBusinessAndProducts$(){
  return of(
    [
    { businessId: '123Nebula', businessName: 'Nebula', products: ['Recarga civica', 'venta pos'] },
    { businessId: '123Gana', businessName: 'Gana', products: ['Recarga', 'recarga minutos'] }
  ]
  );
}

}
