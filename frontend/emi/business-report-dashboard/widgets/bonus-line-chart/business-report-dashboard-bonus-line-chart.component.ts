import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { Component, OnDestroy, OnInit, ViewChild, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import * as Rx from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { of, combineLatest, Observable, forkJoin, concat, Subscription } from 'rxjs';
import { mergeMap, debounceTime, distinctUntilChanged, startWith, tap, map, delay } from 'rxjs/operators';
import { BusinessReportDashboardBonusLineChartService } from './business-report-dashboard-bonus-line-chart.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard-bonus-line-chart',
  templateUrl: './business-report-dashboard-bonus-line-chart.component.html',
  styleUrls: ['./business-report-dashboard-bonus-line-chart.component.scss'],
  animations: fuseAnimations
})
export class BusinessReportDashboardBonusLineChartComponent implements OnInit, OnDestroy {

  timeSpanSelected = '---'
  subTimeSpanSelected = '---'  
  @Output() timeSpan$ = new EventEmitter<{}>();
  @Input()  businessId: string;  

  chartLabels = [];
  bonusLineChartData;
  subscriptions: Subscription[] = [];
  timeSpanOptions: string[];
  windowSize: number[];


  constructor(
    private businessReportDashboardBonusLineChartService: BusinessReportDashboardBonusLineChartService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService,
  ) {
    this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    this.windowSize = [window.innerWidth, window.innerHeight];
    this.registerCustomChartJSPlugin();
    this.loadInitialDataset();
    this.loadDataset();
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadInitialDataset() {
    const dataset = [
      {
        timeSpan: '---',
        scale: '---',
        order: 1,
        labels: ['---', '---', '---', '---', '---', '---', '---'],
        datasets: [
          { order: 1, label: '---', data: [0, 0, 0, 0, 0, 0, 0] },
        ]
      },
    ];
    this.updateDataset(dataset);
  }

  loadDataset() {
    of([
      {
        timeSpan: 'YEAR',
        order: 3,
        scale: 'THOUSANDS',
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        datasets: [
          { order: 3, label: '2015', data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9] },
          { order: 2, label: '2016', data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8] },
          { order: 1, label: '2017', data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9] },
        ]
      },
      {
        timeSpan: 'MONTH',
        order: 2,
        scale: 'THOUSANDS',
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9',
          '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
          '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        datasets: [
          { order: 3, label: 'FEB', data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9, 1.9, 3.2, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9] },
          { order: 2, label: 'MAR', data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8, 2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8] },
          { order: 1, label: 'JUN', data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9] },
        ]
      },
      {
        timeSpan: 'WEEK',
        order: 1,
        scale: 'THOUSANDS',
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRY', 'SAT', 'SUN'],
        datasets: [
          { order: 1, label: 'CURRENT', data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9] },
          { order: 2, label: 'PAST', data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8] },
          { order: 3, label: '2 WEEKS AGO', data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9] },
        ]
      },
    ]).pipe(
      delay(1000),
    ).subscribe(
      (dataset => this.updateDataset(dataset)),
      (error) => console.error(error),
      () => { }
    );

  }

  updateDataset(dataset) {
    this.bonusLineChartData = this.formatDataSet(dataset);
    this.timeSpanOptions = dataset
      .sort((o1, o2) => o1.order - o2.order)
      .map(o => o.timeSpan);
    this.updateTimeSpan(this.timeSpanOptions[0]);
  }


  updateTimeSpan(timeSpan) {
    this.timeSpanSelected = timeSpan;
    const options = this.bonusLineChartData.timeSpans[this.timeSpanSelected].datasetOptions;
    this.updateSubTimeSpan(options[options.length - 1]);
    this.updateChartLabels();
  }

  updateSubTimeSpan(subTimeSpan) {
    this.subTimeSpanSelected = subTimeSpan;
    this.timeSpan$.emit({
      timeSpanSelected: this.timeSpanSelected,
      subTimeSpanSelected: this.subTimeSpanSelected
    });
  }

  updateChartLabels() {
    //This is the only work-around to force labels updates
    this.chartLabels.length = 0;
    this.bonusLineChartData.timeSpans[this.timeSpanSelected].labels.slice().forEach(l => this.chartLabels.push(l))
  }




  /**
   * Listens and keeps tracks of windo size
   * @param event window resize
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowSize = [window.innerWidth, window.innerHeight];
  }

  /**
   * Register a custom plugin to draw the dashed line with the value on top
   */
  registerCustomChartJSPlugin() {
    const that = this;
    (<any>window).Chart.plugins.register({
      afterDatasetsDraw: function (chart, easing) {
        // Only activate the plugin if it's made available
        // in the options
        if (
          !chart.options.plugins.xLabelsOnTop ||
          (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
        ) {
          return;
        }

        // To only draw at the end of animation, check for easing === 1
        const ctx = chart.ctx;


        chart.data.datasets.forEach(function (dataset, i) {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {
              const wh = that.windowSize[0];
              if (wh > 390) {
                // Draw the text in black, with the specified font
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                const ln = meta.data.length;
                const fontSize =
                  ln < 10 ? 13
                    : ln < 20 ? (wh < 500 ? 10 : wh < 900 ? 13 : 13)
                      : wh < 500 ? 5 : wh < 900 ? 8 : 13;
                const fontStyle = 'normal';
                const fontFamily = 'Roboto, Helvetica Neue, Arial';
                ctx.font = (<any>window).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                // Just naively convert to string for now
                const dataString = dataset.data[index].toString();

                // Make sure alignment settings are correct
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const padding = 15;
                const startY = 24;
                const position = element.tooltipPosition();
                ctx.fillText(dataString, position.x, startY);

                ctx.save();

                ctx.beginPath();
                ctx.setLineDash([5, 3]);
                ctx.moveTo(position.x, startY + padding);
                ctx.lineTo(position.x, position.y - padding);
                ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                ctx.stroke();

                ctx.restore();
              }
            });
          }
        });
      }
    });
  }

  /**
   * REcieves a dataset and format it to be chart compatible
   */
  formatDataSet(dataSet) {
    const result = {
      timeSpans: {},
      chartType: 'line',
      colors: [
        {
          borderColor: '#42a5f5',
          backgroundColor: '#42a5f5',
          pointBackgroundColor: '#1e88e5',
          pointHoverBackgroundColor: '#1e88e5',
          pointBorderColor: '#ffffff',
          pointHoverBorderColor: '#ffffff'
        }
      ],
      options: {
        spanGaps: false,
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 32,
            left: 32,
            right: 32
          }
        },
        elements: {
          point: {
            radius: 4,
            borderWidth: 2,
            hoverRadius: 4,
            hoverBorderWidth: 2
          },
          line: {
            tension: 0
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                drawBorder: false,
                tickMarkLength: 10
              },
              ticks: {
                fontColor: '#ffffff'
              }
            }
          ],
          yAxes: [
            {
              display: false,
              ticks: {
                min: 1.5,
                max: 5,
                stepSize: 0.5
              }
            }
          ]
        },
        plugins: {
          filler: {
            propagate: false
          },
          xLabelsOnTop: {
            active: true
          }
        }
      }

    };

    dataSet.forEach(data => {
      const timeSpan = data.timeSpan;
      result.timeSpans[timeSpan] = {
        labels: data.labels,
        datasets: {},
        scale: data.scale,
        datasetOptions: []
      };
      data.datasets.sort((d1, d2) => d2.order - d1.order);
      data.datasets.forEach(d => {
        result.timeSpans[timeSpan].datasetOptions.push(d.label);
        result.timeSpans[timeSpan].datasets[d.label] = [{ label: 'Bonus', data: d.data, fill: 'start' }];
      })

    });

    //console.log(JSON.stringify(result));

    return result;
  }

}
