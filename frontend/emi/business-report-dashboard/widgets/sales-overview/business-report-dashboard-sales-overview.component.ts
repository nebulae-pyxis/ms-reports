import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import * as shape from 'd3-shape';
import * as Rx from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { of, combineLatest, Observable, forkJoin, concat, Subscription, fromEvent } from 'rxjs';
import { mergeMap, debounceTime, distinctUntilChanged, startWith, tap, map } from 'rxjs/operators';
import { BusinessReportDashboardSalesOverviewService } from './business-report-dashboard-sales-overview.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard-sales-overview',
  templateUrl: './business-report-dashboard-sales-overview.component.html',
  styleUrls: ['./business-report-dashboard-sales-overview.component.scss'],

  animations: fuseAnimations
})
export class BusinessReportDashboardSalesOverviewComponent implements OnInit, OnDestroy {

  isSystemAdmin = false;
  SYS_ADMIN = 'SYSADMIN';


  productOpstions: string[];

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
    this.isSystemAdmin = this.keycloakService.getUserRoles(true).includes(this.SYS_ADMIN);



     /**
         * Widget 5
         */
        this.widget5 = {
          currentRange  : 'TW',
          xAxis         : true,
          yAxis         : true,
          gradient      : false,
          legend        : false,
          showXAxisLabel: false,
          xAxisLabel    : 'Days',
          showYAxisLabel: false,
          yAxisLabel    : 'Isues',
          scheme        : {
              domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
          },
          onSelect      : (ev) => {
              console.log(ev);
          },
          supporting    : {
              currentRange  : '',
              xAxis         : false,
              yAxis         : false,
              gradient      : false,
              legend        : false,
              showXAxisLabel: false,
              xAxisLabel    : 'Days',
              showYAxisLabel: false,
              yAxisLabel    : 'Isues',
              scheme        : {
                  domain: ['#42BFF7', '#C6ECFD', '#C7B42C', '#AAAAAA']
              },
              curve         : shape.curveBasis
          }
      };
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  widget5: any = {};
  projects: any[];
  selectedProject: any;
  widgets = {
    'widget5': {
      'title': 'Github Issues',
      'ranges': {
        'TW': 'This Week',
        'LW': 'Last Week',
        '2W': '2 Weeks Ago'
      },
      'mainChart': {
        '2W': [
          {
            'name': 'Mon',
            'series': [
              {
                'name': 'issues',
                'value': 37
              },
              {
                'name': 'closed issues',
                'value': 9
              }
            ]
          },
          {
            'name': 'Tue',
            'series': [
              {
                'name': 'issues',
                'value': 32
              },
              {
                'name': 'closed issues',
                'value': 12
              }
            ]
          },
          {
            'name': 'Wed',
            'series': [
              {
                'name': 'issues',
                'value': 39
              },
              {
                'name': 'closed issues',
                'value': 9
              }
            ]
          },
          {
            'name': 'Thu',
            'series': [
              {
                'name': 'issues',
                'value': 27
              },
              {
                'name': 'closed issues',
                'value': 12
              }
            ]
          },
          {
            'name': 'Fri',
            'series': [
              {
                'name': 'issues',
                'value': 18
              },
              {
                'name': 'closed issues',
                'value': 7
              }
            ]
          },
          {
            'name': 'Sat',
            'series': [
              {
                'name': 'issues',
                'value': 24
              },
              {
                'name': 'closed issues',
                'value': 8
              }
            ]
          },
          {
            'name': 'Sun',
            'series': [
              {
                'name': 'issues',
                'value': 20
              },
              {
                'name': 'closed issues',
                'value': 16
              }
            ]
          }
        ],
        'LW': [
          {
            'name': 'Mon',
            'series': [
              {
                'name': 'issues',
                'value': 37
              },
              {
                'name': 'closed issues',
                'value': 12
              }
            ]
          },
          {
            'name': 'Tue',
            'series': [
              {
                'name': 'issues',
                'value': 24
              },
              {
                'name': 'closed issues',
                'value': 8
              }
            ]
          },
          {
            'name': 'Wed',
            'series': [
              {
                'name': 'issues',
                'value': 51
              },
              {
                'name': 'closed issues',
                'value': 7
              }
            ]
          },
          {
            'name': 'Thu',
            'series': [
              {
                'name': 'issues',
                'value': 31
              },
              {
                'name': 'closed issues',
                'value': 13
              }
            ]
          },
          {
            'name': 'Fri',
            'series': [
              {
                'name': 'issues',
                'value': 29
              },
              {
                'name': 'closed issues',
                'value': 7
              }
            ]
          },
          {
            'name': 'Sat',
            'series': [
              {
                'name': 'issues',
                'value': 17
              },
              {
                'name': 'closed issues',
                'value': 6
              }
            ]
          },
          {
            'name': 'Sun',
            'series': [
              {
                'name': 'issues',
                'value': 31
              },
              {
                'name': 'closed issues',
                'value': 10
              }
            ]
          }
        ],
        'TW': [
          {
            'name': 'Mon',
            'series': [
              {
                'name': 'issues',
                'value': 42
              },
              {
                'name': 'closed issues',
                'value': 11
              }
            ]
          },
          {
            'name': 'Tue',
            'series': [
              {
                'name': 'issues',
                'value': 28
              },
              {
                'name': 'closed issues',
                'value': 10
              }
            ]
          },
          {
            'name': 'Wed',
            'series': [
              {
                'name': 'issues',
                'value': 43
              },
              {
                'name': 'closed issues',
                'value': 8
              }
            ]
          },
          {
            'name': 'Thu',
            'series': [
              {
                'name': 'issues',
                'value': 34
              },
              {
                'name': 'closed issues',
                'value': 11
              }
            ]
          },
          {
            'name': 'Fri',
            'series': [
              {
                'name': 'issues',
                'value': 20
              },
              {
                'name': 'closed issues',
                'value': 8
              }
            ]
          },
          {
            'name': 'Sat',
            'series': [
              {
                'name': 'issues',
                'value': 25
              },
              {
                'name': 'closed issues',
                'value': 10
              }
            ]
          },
          {
            'name': 'Sun',
            'series': [
              {
                'name': 'issues',
                'value': 22
              },
              {
                'name': 'closed issues',
                'value': 17
              }
            ]
          }
        ]
      },
      'supporting': {
        'created': {
          'label': 'CREATED',
          'count': {
            '2W': 48,
            'LW': 46,
            'TW': 54
          },
          'chart': {
            '2W': [
              {
                'name': 'CREATED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 5
                  },
                  {
                    'name': 'Tue',
                    'value': 8
                  },
                  {
                    'name': 'Wed',
                    'value': 5
                  },
                  {
                    'name': 'Thu',
                    'value': 6
                  },
                  {
                    'name': 'Fri',
                    'value': 7
                  },
                  {
                    'name': 'Sat',
                    'value': 8
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ],
            'LW': [
              {
                'name': 'Created',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 6
                  },
                  {
                    'name': 'Tue',
                    'value': 3
                  },
                  {
                    'name': 'Wed',
                    'value': 7
                  },
                  {
                    'name': 'Thu',
                    'value': 5
                  },
                  {
                    'name': 'Fri',
                    'value': 5
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ],
            'TW': [
              {
                'name': 'Created',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 3
                  },
                  {
                    'name': 'Tue',
                    'value': 2
                  },
                  {
                    'name': 'Wed',
                    'value': 1
                  },
                  {
                    'name': 'Thu',
                    'value': 4
                  },
                  {
                    'name': 'Fri',
                    'value': 8
                  },
                  {
                    'name': 'Sat',
                    'value': 8
                  },
                  {
                    'name': 'Sun',
                    'value': 4
                  }
                ]
              }
            ]
          }
        },
        'closed': {
          'label': 'CLOSED',
          'count': {
            '2W': 27,
            'LW': 31,
            'TW': 26
          },
          'chart': {
            '2W': [
              {
                'name': 'CLOSED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 3
                  },
                  {
                    'name': 'Tue',
                    'value': 2
                  },
                  {
                    'name': 'Wed',
                    'value': 1
                  },
                  {
                    'name': 'Thu',
                    'value': 4
                  },
                  {
                    'name': 'Fri',
                    'value': 8
                  },
                  {
                    'name': 'Sat',
                    'value': 8
                  },
                  {
                    'name': 'Sun',
                    'value': 4
                  }
                ]
              }
            ],
            'LW': [
              {
                'name': 'CLOSED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 6
                  },
                  {
                    'name': 'Tue',
                    'value': 5
                  },
                  {
                    'name': 'Wed',
                    'value': 4
                  },
                  {
                    'name': 'Thu',
                    'value': 5
                  },
                  {
                    'name': 'Fri',
                    'value': 7
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ],
            'TW': [
              {
                'name': 'CLOSED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 6
                  },
                  {
                    'name': 'Tue',
                    'value': 3
                  },
                  {
                    'name': 'Wed',
                    'value': 7
                  },
                  {
                    'name': 'Thu',
                    'value': 5
                  },
                  {
                    'name': 'Fri',
                    'value': 5
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ]
          }
        },
        'reOpened': {
          'label': 'RE-OPENED',
          'count': {
            '2W': 4,
            'LW': 5,
            'TW': 2
          },
          'chart': {
            '2W': [
              {
                'name': 'RE-OPENED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 6
                  },
                  {
                    'name': 'Tue',
                    'value': 3
                  },
                  {
                    'name': 'Wed',
                    'value': 7
                  },
                  {
                    'name': 'Thu',
                    'value': 5
                  },
                  {
                    'name': 'Fri',
                    'value': 5
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ],
            'LW': [
              {
                'name': 'RE-OPENED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 5
                  },
                  {
                    'name': 'Tue',
                    'value': 7
                  },
                  {
                    'name': 'Wed',
                    'value': 8
                  },
                  {
                    'name': 'Thu',
                    'value': 8
                  },
                  {
                    'name': 'Fri',
                    'value': 6
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 1
                  }
                ]
              }
            ],
            'TW': [
              {
                'name': 'RE-OPENED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 3
                  },
                  {
                    'name': 'Tue',
                    'value': 2
                  },
                  {
                    'name': 'Wed',
                    'value': 1
                  },
                  {
                    'name': 'Thu',
                    'value': 4
                  },
                  {
                    'name': 'Fri',
                    'value': 8
                  },
                  {
                    'name': 'Sat',
                    'value': 8
                  },
                  {
                    'name': 'Sun',
                    'value': 4
                  }
                ]
              }
            ]
          }
        },
        'wontFix': {
          'label': 'WON\'T FIX',
          'count': {
            '2W': 6,
            'LW': 3,
            'TW': 4
          },
          'chart': {
            '2W': [
              {
                'name': 'WON\'T FIX',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 5
                  },
                  {
                    'name': 'Tue',
                    'value': 7
                  },
                  {
                    'name': 'Wed',
                    'value': 4
                  },
                  {
                    'name': 'Thu',
                    'value': 6
                  },
                  {
                    'name': 'Fri',
                    'value': 5
                  },
                  {
                    'name': 'Sat',
                    'value': 3
                  },
                  {
                    'name': 'Sun',
                    'value': 2
                  }
                ]
              }
            ],
            'LW': [
              {
                'name': 'WON\'T FIX',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 6
                  },
                  {
                    'name': 'Tue',
                    'value': 3
                  },
                  {
                    'name': 'Wed',
                    'value': 7
                  },
                  {
                    'name': 'Thu',
                    'value': 5
                  },
                  {
                    'name': 'Fri',
                    'value': 5
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ],
            'TW': [
              {
                'name': 'WON\'T FIX',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 6
                  },
                  {
                    'name': 'Tue',
                    'value': 5
                  },
                  {
                    'name': 'Wed',
                    'value': 4
                  },
                  {
                    'name': 'Thu',
                    'value': 5
                  },
                  {
                    'name': 'Fri',
                    'value': 7
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ]
          }
        },
        'needsTest': {
          'label': 'NEEDS TEST',
          'count': {
            '2W': 10,
            'LW': 7,
            'TW': 8
          },
          'chart': {
            '2W': [
              {
                'name': 'NEEDS TEST',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 6
                  },
                  {
                    'name': 'Tue',
                    'value': 5
                  },
                  {
                    'name': 'Wed',
                    'value': 4
                  },
                  {
                    'name': 'Thu',
                    'value': 5
                  },
                  {
                    'name': 'Fri',
                    'value': 7
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ],
            'LW': [
              {
                'name': 'NEEDS TEST',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 5
                  },
                  {
                    'name': 'Tue',
                    'value': 7
                  },
                  {
                    'name': 'Wed',
                    'value': 8
                  },
                  {
                    'name': 'Thu',
                    'value': 8
                  },
                  {
                    'name': 'Fri',
                    'value': 6
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 1
                  }
                ]
              }
            ],
            'TW': [
              {
                'name': 'NEEDS TEST',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 6
                  },
                  {
                    'name': 'Tue',
                    'value': 3
                  },
                  {
                    'name': 'Wed',
                    'value': 7
                  },
                  {
                    'name': 'Thu',
                    'value': 5
                  },
                  {
                    'name': 'Fri',
                    'value': 5
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ]
          }
        },
        'fixed': {
          'label': 'FIXED',
          'count': {
            '2W': 21,
            'LW': 17,
            'TW': 14
          },
          'chart': {
            '2W': [
              {
                'name': 'FIXED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 5
                  },
                  {
                    'name': 'Tue',
                    'value': 7
                  },
                  {
                    'name': 'Wed',
                    'value': 8
                  },
                  {
                    'name': 'Thu',
                    'value': 8
                  },
                  {
                    'name': 'Fri',
                    'value': 6
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 1
                  }
                ]
              }
            ],
            'LW': [
              {
                'name': 'FIXED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 6
                  },
                  {
                    'name': 'Tue',
                    'value': 5
                  },
                  {
                    'name': 'Wed',
                    'value': 4
                  },
                  {
                    'name': 'Thu',
                    'value': 5
                  },
                  {
                    'name': 'Fri',
                    'value': 7
                  },
                  {
                    'name': 'Sat',
                    'value': 4
                  },
                  {
                    'name': 'Sun',
                    'value': 7
                  }
                ]
              }
            ],
            'TW': [
              {
                'name': 'FIXED',
                'series': [
                  {
                    'name': 'Mon',
                    'value': 5
                  },
                  {
                    'name': 'Tue',
                    'value': 7
                  },
                  {
                    'name': 'Wed',
                    'value': 4
                  },
                  {
                    'name': 'Thu',
                    'value': 6
                  },
                  {
                    'name': 'Fri',
                    'value': 5
                  },
                  {
                    'name': 'Sat',
                    'value': 3
                  },
                  {
                    'name': 'Sun',
                    'value': 2
                  }
                ]
              }
            ]
          }
        }
      }
    },
  };



}
