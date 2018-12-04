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
import { mergeMap, debounceTime, delay, startWith, tap, map } from 'rxjs/operators';
import { BusinessReportDashboardNetBonusDistributionService } from './business-report-dashboard-net-bonus-distribution.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard-net-bonus-distribution',
  templateUrl: './business-report-dashboard-net-bonus-distribution.component.html',
  styleUrls: ['./business-report-dashboard-net-bonus-distribution.component.scss'],

  animations: fuseAnimations
})
export class BusinessReportDashboardNetBonusDistributionComponent implements OnInit, OnDestroy {

  @Input() businessId;
  @Input() timeSpanSelected;
  @Input() subTimeSpanSelected;


  initialData: any = {
    'title': 'BONUS_DISTRIBUTION',
    '---': {
      '---': {
        'mainChart': [{ name: '...', value: 100 }],
        'footerLeft': { 'title': 'Bonus', 'count': 0 },
        'footerRight': { 'title': 'Count', 'count': 0 },
      }
    }
  };

  subscriptions: Subscription[] = []
  chardData: any = undefined;


  chartConfigs: any = {
    legend: false,
    explodeSlices: false,
    labels: true,
    doughnut: true,
    gradient: false,
    showLegend: false,
    scheme: {
      domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
    },
    onSelect: (ev) => {
      console.log(ev);
    }
  };

  constructor(
    private businessReportDashboardNetBonusDistributionService: BusinessReportDashboardNetBonusDistributionService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
  ) {
    this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {

    of((
      [
        {
          timespan: "YEAR", datasets: [
            { timespan: '2017', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
            { timespan: '2016', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
            { timespan: '2015', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
          ],
        },
        {
          timespan: "MONTH", datasets: [
            { timespan: 'FEB', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
            { timespan: 'MAR', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
            { timespan: 'JUN', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
          ],
        },
        {
          timespan: "WEEK", datasets: [
            { timespan: '2 WEEKS AGO', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
            { timespan: 'PAST', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
            { timespan: 'CURRENT', dataset: [{ product: 'Civica', percentage: 50, value: 12000, count: 123 }, { product: 'Tigo', percentage: 50, value: 45000, count: 6543 }] },
          ],
        },
      ]
    )).pipe(
      delay(1000),
      map(ds => this.formatData(ds))
    ).subscribe(
      (fds) => this.chardData = fds,
      (err) => console.error(err),
      () => { }
    );
  }

  formatData(datasets) {
    const formated = datasets.reduce((form, obj) => {
      form[obj.timespan] = obj.datasets.reduce((dataset, ds) => {
        dataset[ds.timespan] = {
          'mainChart': ds.dataset.map(d => ({ name: d.product, value: d.percentage })),
          'footerLeft': { 'title': 'Bonus', 'count': ds.dataset.reduce((total, d) => total + d.value, 0) },
          'footerRight': { 'title': 'Count', 'count': ds.dataset.reduce((total, d) => total + d.count, 0) },
        }
        return dataset;
      }, {});
      return form;
    }, {});
    formated.title = 'BONUS_DISTRIBUTION';
    return formated;
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
