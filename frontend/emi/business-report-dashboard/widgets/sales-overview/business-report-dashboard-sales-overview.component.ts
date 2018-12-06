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
import { BusinessReportDashboardSalesOverviewService } from './business-report-dashboard-sales-overview.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard-sales-overview',
  templateUrl: './business-report-dashboard-sales-overview.component.html',
  styleUrls: ['./business-report-dashboard-sales-overview.component.scss'],

  animations: fuseAnimations
})
export class BusinessReportDashboardSalesOverviewComponent implements OnInit, OnDestroy {



  @Input() businessId;
  @Input() timeSpanSelected;
  @Input() subTimeSpanSelected;



  initialRawData = [
    {
      timespan: "---",
      datasets: [
        {
          timespan: '---',
          scale: '---',
          labels: ['...', '..,', '.,.', '.,,', ',..', ',.,', ',,.'],
          datasets: {
            mainSales: [0, 0, 0, 0, 0, 0, 0], bonusSales: [0, 0, 0, 0, 0, 0, 0], creditSales: [0, 0, 0, 0, 0, 0, 0],
            mainBalance: [0, 0, 0, 0, 0, 0, 0], bonusBalance: [0, 0, 0, 0, 0, 0, 0], salesQty: [0, 0, 0, 0, 0, 0, 0], bonusQty: [0, 0, 0, 0, 0, 0, 0],
          },
        }
      ],
    }
  ];
  initialChartData = this.formatDatasets(this.initialRawData);
  chartDataset: any = undefined;


  chartConfigs = {
    currentRange: 'TW',
    xAxis: true,
    yAxis: true,
    gradient: false,
    legend: false,
    showXAxisLabel: false,
    xAxisLabel: 'Days',
    showYAxisLabel: false,
    yAxisLabel: 'Isues',
    scheme: {
      domain: ['#42BFF7', '#C6ECFD', '#F6BCBC', '#AAAAAA']
    },
    supporting: {
      currentRange: '',
      xAxis: false,
      yAxis: false,
      gradient: false,
      legend: false,
      showXAxisLabel: false,
      xAxisLabel: 'Days',
      showYAxisLabel: false,
      yAxisLabel: 'Isues',
      scheme: {
        domain: ['#42BFF7', '#C6ECFD', '#F6BCBC', '#AAAAAA']
      },
      curve: shape.curveBasis
    }
  };
  chartLabels = [];

  subscriptions: Subscription[] = [];

  constructor(
    private businessReportDashboardWalletStatusCardsService: BusinessReportDashboardSalesOverviewService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
  ) {
    this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    setTimeout(() => this.loadDataset(), 500);
  }

  loadDataset() {
    this.businessReportDashboardWalletStatusCardsService.businessReportDashboardSalesOverview$(this.businessId).pipe(
      map(ds => this.formatDatasets([ ...ds, ...this.initialRawData]))
    ).subscribe(
      (fds) => this.chartDataset = fds,
      (err) => console.error(err),
      () => { }
    );
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  formatDatasets(datasets) {
    const formated = datasets.reduce((form, obj) => {
      form[obj.timespan] = obj.datasets.reduce((dataset, ds) => {
        dataset[ds.timespan] = {
          mainChartData: this.getMainChartData(ds),
          supportingChartData: this.getSupportingChartData(ds),
        }
        return dataset;
      }, {});
      return form;
    }, {});
    return formated;
  }


  getMainChartData(dataset) {
    return dataset.labels.map((name, i) => ({
      name,
      series: [
        { name: 'Using main', value: dataset.datasets.mainSales[i] },
        { name: 'Using Bonus', value: dataset.datasets.bonusSales[i] },
        { name: 'Using credit', value: dataset.datasets.creditSales[i] },
      ]
    }));
  }

  getSupportingChartData(dataset) {
    return {
      mainBalance: {
        label: 'Saldo bolsa',
        acc: '',
        chart: [{ name: 'Main balance', series: dataset.labels.map((name, i) => ({ name, value: dataset.datasets.mainBalance[i] })) }]
      },

      salesQty: {
        label: 'Cantindad de ventas',
        acc: dataset.datasets.salesQty.reduce((total, val) => total + val),
        chart: [{ name: 'Sales quantity', series: dataset.labels.map((name, i) => ({ name, value: dataset.datasets.salesQty[i] })) }]
      },

      bonusBalance: {
        label: 'Saldo comisión',
        acc: '',
        chart: [{ name: 'Bonus balance', series: dataset.labels.map((name, i) => ({ name, value: dataset.datasets.bonusBalance[i] })) }]
      },
      bonusQty: {
        label: 'Cantidad de comisiones',
        acc: dataset.datasets.bonusQty.reduce((total, val) => total + val),
        chart: [{ name: 'Bonus quantity', series: dataset.labels.map((name, i) => ({ name, value: dataset.datasets.bonusQty[i] })) }]
      },
    };
  }






}
