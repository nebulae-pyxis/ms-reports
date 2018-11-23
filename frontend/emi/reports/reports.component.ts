import { reportsService } from './reports.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import * as Rx from 'rxjs/Rx';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: fuseAnimations
})
export class reportsComponent implements OnInit, OnDestroy {
  
  helloWorld: String = 'Hello World static';
  helloWorldLabelQuery$: Rx.Observable<any>;
  helloWorldLabelSubscription$: Rx.Observable<any>;

  constructor(private reportservice: reportsService  ) {    

  }
    

  ngOnInit() {
    this.helloWorldLabelQuery$ = this.reportservice.getHelloWorld$();
    this.helloWorldLabelSubscription$ = this.reportservice.getEventSourcingMonitorHelloWorldSubscription$();
  }

  
  ngOnDestroy() {
  }

}
