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
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    public snackBar: MatSnackBar,
    private businessReportDashboardWalletStatusCardsService: BusinessReportDashboardWalletStatusCardsService,
    private keycloakService: KeycloakService
  ) {
    this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    this.loadInitialData();
    setTimeout(() => this.loadDataset() , 500);
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
      title: 'SPENDING_ALLOWED',
      value: walletStatus.spendingAllowed,
      valueDesc: this.translationLoader.getTranslate().instant(`WALLET_STATUS.SPENDING_ALLOWED.DESC`),
      lastUpdate: Date.now(),
      valueColor: 'green-fg',
    });
    this.dataset = dataset;
  }


}
