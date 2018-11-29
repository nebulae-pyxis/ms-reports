import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import * as Rx from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { of, combineLatest, Observable, forkJoin, concat, Subscription } from 'rxjs';
import { mergeMap, debounceTime, distinctUntilChanged, startWith, tap, map } from 'rxjs/operators';
import { BusinessReportDashboardBonusLineChartService } from './business-report-dashboard-bonus-line-chart.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard-bonus-line-chart',
  templateUrl: './business-report-dashboard-bonus-line-chart.component.html',
  styleUrls: ['./business-report-dashboard-bonus-line-chart.component.scss'],
  animations: fuseAnimations
})
export class BusinessReportDashboardBonusLineChartComponent implements OnInit, OnDestroy {

  isSystemAdmin = false;
  SYS_ADMIN = 'SYSADMIN';


  productOpstions: string[];

  subscriptions: Subscription[] = [];

  constructor(
    private businessReportDashboardBonusLineChartService: BusinessReportDashboardBonusLineChartService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
  ) {
    this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    this.isSystemAdmin = this.keycloakService.getUserRoles(true).includes(this.SYS_ADMIN);
    this.registerCustomChartJSPlugin();
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  /**
   * Register a custom plugin
   */
  registerCustomChartJSPlugin() {
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

              // Draw the text in black, with the specified font
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              const fontSize = 13;
              const fontStyle = 'normal';
              const fontFamily = 'Roboto, Helvetica Neue, Arial';
              ctx.font = (<any>window).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

              // Just naively convert to string for now
              const dataString = dataset.data[index].toString() + 'k';

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
            });
          }
        });
      }
    });
  }



  bonusLineChartSelectedYear = '2016';
  bonusLineChartSelectedDay = 'today';
  bonusLineChartData = {
    chartType: 'line',
    datasets: {
      '2015': [
        {
          label: 'Sales',
          data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9],
          fill: 'start'

        }
      ],
      '2016': [
        {
          label: 'Sales',
          data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8],
          fill: 'start'

        }
      ],
      '2017': [
        {
          label: 'Sales',
          data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9],
          fill: 'start'

        }
      ]

    },
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
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
              tickMarkLength: 18
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

}
