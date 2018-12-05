import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import * as Rx from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { of, combineLatest, Observable, forkJoin, concat, Subscription } from 'rxjs';
import { mergeMap, debounceTime, distinctUntilChanged, startWith, tap, map, delay } from 'rxjs/operators';
import { BusinessReportDashboardWalletStatusCardsService } from './business-report-dashboard-wallet-status-cards.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard-wallet-status-cards',
  templateUrl: './business-report-dashboard-wallet-status-cards.component.html',
  styleUrls: ['./business-report-dashboard-wallet-status-cards.component.scss'],

  animations: fuseAnimations
})
export class BusinessReportDashboardWalletStatusCardsComponent implements OnInit, OnDestroy {


  @Input() businessId;
  @Input() timeSpanSelected;
  
  subscriptions: Subscription[] = [];
  dataset: any;

  constructor(
    private businessReportDashboardWalletStatusCardsService: BusinessReportDashboardWalletStatusCardsService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
  ) {
    this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    this.loadInitialData();
    this.loadDataset();
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadInitialData() {
    this.dataset = [0, 1, 2, 3].map(i => ({
      title: '---',
      value: '---',
      valueDesc: '',
      lastUpdate: 0,
      valueColor: 'gray-fg',
    }));
  };

  loadDataset() {
    this.businessReportDashboardWalletStatusCardsService.businessReportDashboardWalletStatusCards$(this.businessId).pipe(
      delay(1000)
    ).subscribe(
      (dataset) => this.buildDataset(dataset),
      (err) => console.error(err),
      () => { }
    );
  }

  buildDataset(walletStatus) {
    walletStatus.pockets.sort((p1, p2) => p1.order - p2.order);
    const dataset = walletStatus.pockets
      .map(p => ({
        title: p.name,
        value: p.balance,
        valueDesc: p.currency,
        valueColor: 'dark-grey-fg',
        valueIsCurrency: true,
        lastUpdate: p.lastUpdate
      }));
    dataset.push({
      title: 'Ventas permitidas',
      value: walletStatus.spendingAllowed ? 'SI' : 'NO',
      valueDesc: '',
      lastUpdate: Date.now(),
      valueColor: 'green-fg',
    });
    this.dataset = dataset;
  }


}
