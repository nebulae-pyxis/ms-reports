////////// ANGULAR & Fuse UI //////////
import { Component, OnDestroy, OnInit, ViewChild, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { fuseAnimations } from '../../../../../core/animations';

////////// RXJS //////////
import { of, combineLatest, Observable, forkJoin, concat, Subscription, Subject } from 'rxjs';
import { mergeMap, debounceTime, distinctUntilChanged, startWith, tap, map, delay } from 'rxjs/operators';

//////////// i18n ////////////
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { TranslateService, LangChangeEvent, TranslationChangeEvent } from "@ngx-translate/core";
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';

//////////// Services ////////////
import { KeycloakService } from 'keycloak-angular';
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
  @Input() subTimeSpanSelected;


  initialData: any = {
    'title': 'SALES_DISTRIBUTION',
    '---': {
      '---': {
        'mainChart': [{ name: '...', value: 100 }],
        'footerLeft': { 'title': 'FOOTER_LEFT', 'count': 0 },
        'footerRight': { 'title': 'FOOTER_RIGHT', 'count': 0 },
      }
    }
  };

  subscriptions: Subscription[] = []
  chardData = undefined;


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
    private businessReportDashboardNetSalesDistributionService: BusinessReportDashboardNetSalesDistributionService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
  ) {
    this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    setTimeout(() => this.loadData() , 500);
  }


  loadData() {
    this.businessReportDashboardNetSalesDistributionService.businessReportDashboardNetSalesDistribution$(this.businessId).pipe(
      map(ds => ds.slice()),
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
          'footerLeft': { 'title': 'FOOTER_LEFT', 'count': ds.dataset.reduce((total, d) => total + d.value, 0) },
          'footerRight': { 'title': 'FOOTER_RIGHT', 'count': ds.dataset.reduce((total, d) => total + d.count, 0) },
        }
        return dataset;
      }, {});
      return form;
    }, {});
    formated.title = 'TITLE';
    formated['---'] = {
      '---': {
        'mainChart': [{ name: '...', value: 100 }],
        'footerLeft': { 'title': 'FOOTER_LEFT', 'count': 0 },
        'footerRight': { 'title': 'FOOTER_RIGHT', 'count': 0 },
      }
    };
    return formated;
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
