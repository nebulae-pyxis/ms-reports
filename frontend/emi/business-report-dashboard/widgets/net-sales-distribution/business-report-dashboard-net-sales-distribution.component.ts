import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import * as shape from 'd3-shape';
import * as Rx from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { of, combineLatest, Observable, forkJoin, concat, Subscription, fromEvent } from 'rxjs';
import { mergeMap, debounceTime, distinctUntilChanged, startWith, tap, map } from 'rxjs/operators';
import { BusinessReportDashboardNetSalesDistributionService } from './business-report-dashboard-net-sales-distribution.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard-net-sales-distribution',
  templateUrl: './business-report-dashboard-net-sales-distribution.component.html',
  styleUrls: ['./business-report-dashboard-net-sales-distribution.component.scss'],

  animations: fuseAnimations
})
export class BusinessReportDashboardNetSalesDistributionComponent implements OnInit, OnDestroy {

  @Input() businessId;
  @Input() timeSpanSelected;
  
  productOpstions: string[];

  subscriptions: Subscription[] = [];

  constructor(
    private businessReportDashboardNetSalesDistributionService: BusinessReportDashboardNetSalesDistributionService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
  ) {
    this.translationLoader.loadTranslations(english, spanish);

    /**
         * Widget 6
         */
    this.widget6 = {
      currentRange: 'TW',
      legend: false,
      explodeSlices: false,
      labels: true,
      doughnut: true,
      gradient: false,
      scheme: {
        domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
      },
      onSelect: (ev) => {
        console.log(ev);
      }
    };
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  widget6: any = {};
  widgets = {
    'widget6': {
      'title': 'Task Distribution',
      'ranges': {
        'TW': 'This Week',
        'LW': 'Last Week',
        '2W': '2 Weeks Ago'
      },
      'mainChart': {
        'TW': [
          {
            'name': 'Frontend',
            'value': 15
          },
          {
            'name': 'Backend',
            'value': 20
          },
          {
            'name': 'API',
            'value': 38
          },
          {
            'name': 'Issues',
            'value': 27
          }
        ],
        'LW': [
          {
            'name': 'Frontend',
            'value': 19
          },
          {
            'name': 'Backend',
            'value': 16
          },
          {
            'name': 'API',
            'value': 42
          },
          {
            'name': 'Issues',
            'value': 23
          }
        ],
        '2W': [
          {
            'name': 'Frontend',
            'value': 18
          },
          {
            'name': 'Backend',
            'value': 17
          },
          {
            'name': 'API',
            'value': 40
          },
          {
            'name': 'Issues',
            'value': 25
          }
        ]
      },
      'footerLeft': {
        'title': 'Tasks Added',
        'count': {
          '2W': 487,
          'LW': 526,
          'TW': 594
        }
      },
      'footerRight': {
        'title': 'Tasks Completed',
        'count': {
          '2W': 193,
          'LW': 260,
          'TW': 287
        }
      }
    },
  };





}
