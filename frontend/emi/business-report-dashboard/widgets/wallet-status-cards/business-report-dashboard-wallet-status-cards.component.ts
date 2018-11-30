import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import * as Rx from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { of, combineLatest, Observable, forkJoin, concat, Subscription } from 'rxjs';
import { mergeMap, debounceTime, distinctUntilChanged, startWith, tap, map } from 'rxjs/operators';
import { BusinessReportDashboardWalletStatusCardsService } from './business-report-dashboard-wallet-status-cards.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard-wallet-status-cards',
  templateUrl: './business-report-dashboard-wallet-status-cards.component.html',
  styleUrls: ['./business-report-dashboard-wallet-status-cards.component.scss'],
  
  animations: fuseAnimations
})
export class BusinessReportDashboardWalletStatusCardsComponent implements OnInit, OnDestroy {

  isSystemAdmin = false;
  SYS_ADMIN = 'SYSADMIN';


  productOpstions: string[];

  subscriptions: Subscription[] = [];

  constructor(
    private businessReportDashboardWalletStatusCardsService: BusinessReportDashboardWalletStatusCardsService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
  ) {
    this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    this.isSystemAdmin = this.keycloakService.getUserRoles(true).includes(this.SYS_ADMIN);

  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  projects: any[];
  selectedProject: any;
  widgets = {
    'widget1': {
      'ranges': {
        'DY': 'Yesterday',
        'DT': 'Today',
        'DTM': 'Tomorrow'
      },
      'currentRange': 'DT',
      'data': {
        'label': 'DUE TASKS',
        'count': {
          'DY': 21,
          'DT': 25,
          'DTM': 19
        },
        'extra': {
          'label': 'Completed',
          'count': {
            'DY': 6,
            'DT': 7,
            'DTM': '-'
          }

        }
      },
      'detail': 'You can show some detailed information about this widget in here.'
    },
    'widget2': {
      'title': 'Overdue',
      'data': {
        'label': 'TASKS',
        'count': 4,
        'extra': {
          'label': 'Yesterday\'s overdue',
          'count': 2
        }
      },
      'detail': 'You can show some detailed information about this widget in here.'
    },
    'widget3': {
      'title': 'Issues',
      'data': {
        'label': 'OPEN',
        'count': 32,
        'extra': {
          'label': 'Closed today',
          'count': 0
        }
      },
      'detail': 'You can show some detailed information about this widget in here.'
    },
    'widget4': {
      'title': 'Features',
      'data': {
        'label': 'PROPOSALS',
        'count': 42,
        'extra': {
          'label': 'Implemented',
          'count': 8
        }
      },
      'detail': 'You can show some detailed information about this widget in here.'
    },    
  };



}
