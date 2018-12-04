import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from './../../../core/services/translation-loader.service';
import { Component, OnDestroy, OnInit, ViewChild, EventEmitter} from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import * as Rx from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { of, combineLatest, Observable, forkJoin, concat, Subscription } from 'rxjs';
import { mergeMap, debounceTime, distinctUntilChanged, startWith, tap, map } from 'rxjs/operators';
import { BusinessReportDashboardService } from './business-report-dashboard.service';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'business-report-dashboard',
  templateUrl: './business-report-dashboard.component.html',
  styleUrls: ['./business-report-dashboard.component.scss'],
  animations: fuseAnimations
})
export class BusinessReportDashboardComponent implements OnInit, OnDestroy {

  isPlatformAdmin = false;
  PLATFORM_ADMIN = 'PLATFORM-ADMIN';  
  businessId = '';
  

  subscriptions: Subscription[] = [];
  timeSpanSelected: String;
  subTimeSpanSelected: String;

  constructor(
    private businessReportDashboardService: BusinessReportDashboardService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
  ) {
    this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    this.isPlatformAdmin = this.keycloakService.getUserRoles(true).includes(this.PLATFORM_ADMIN);
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ontimeSpanSelected({timeSpanSelected,subTimeSpanSelected}){
    this.timeSpanSelected = timeSpanSelected;
    this.subTimeSpanSelected = subTimeSpanSelected;
    console.log({timeSpanSelected,subTimeSpanSelected});
  }


  
}
