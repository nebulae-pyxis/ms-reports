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
import { timeout } from 'async';


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

  options =  {
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
            min: 0,
            max: 100,
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
  };


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
    setTimeout(() => this.loadDataset() , 500);
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadInitialDataset() {
    const dataset = [
      {
        timespan: '---',
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
    this.businessReportDashboardBonusLineChartService.businessReportDashboardBonusLineChart$(this.businessId).pipe(
    ).subscribe(
      (dataset => this.updateDataset(dataset.slice())),
      (error) => console.error(error),
      () => { }
    );

  }

  updateDataset(dataset) {
    this.bonusLineChartData = this.formatDataSet(dataset);        
    this.timeSpanOptions = dataset
      .sort((o1, o2) => o1.order - o2.order)
      .map(o => o.timespan);      
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
      

    };

    dataSet.forEach(data => {      
      const timeSpan = data.timespan;
      result.timeSpans[timeSpan] = {
        labels: data.labels,
        datasets: {},
        scale: data.scale,
        datasetOptions: []
      };      
      const datasets = data.datasets.slice();
      datasets.sort((d1, d2) => d2.order - d1.order);
      datasets.forEach(d => {        
        result.timeSpans[timeSpan].datasetOptions.push(d.label);
        result.timeSpans[timeSpan].datasets[d.label] = [{ label: 'Bonus', data: d.data, fill: 'start' }];        
        
        const yMax = Math.max(...d.data);      
        console.log(`${yMax} vs ${this.options.scales.yAxes[0].ticks.max}`); 
        if(this.options.scales.yAxes[0].ticks.max < yMax){
          this.options = {...this.options};
          this.options.scales.yAxes[0].ticks.max = yMax;
        }
        
      })

    });
    return result;
  }

}
