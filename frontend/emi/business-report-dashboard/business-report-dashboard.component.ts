import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from './../../../core/services/translation-loader.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import * as Rx from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { of, combineLatest, Observable, forkJoin, concat, Subscription } from 'rxjs';
import { mergeMap, debounceTime, distinctUntilChanged, startWith, tap, map } from 'rxjs/operators';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard',
  templateUrl: './business-report-dashboard.component.html',
  styleUrls: ['./business-report-dashboard.component.scss'],
  animations: fuseAnimations
})
export class BusinessReportDashboardComponent implements OnInit, OnDestroy {

  isSystemAdmin = false;
  SYS_ADMIN = 'SYSADMIN';


  productOpstions: string[];

  subscriptions: Subscription[] = [];

  constructor(
    private BusinessReportDashboardService: BusinessReportDashboardService,
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

}
