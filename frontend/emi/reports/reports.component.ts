import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from './../../../core/services/translation-loader.service';
import { reportsService } from './reports.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import { Subscription } from 'rxjs/Subscription';
import * as Rx from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { MapRef } from './entities/agmMapRef';
import { MarkerCluster } from './entities/markerCluster';
import { MarkerRef, MarkerRefInfoWindowContent, MarkerRefTitleContent } from './entities/markerRef';
import { of, combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, tap, map } from 'rxjs/operators';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: fuseAnimations
})
export class reportsComponent implements OnInit, OnDestroy {

  isSystemAdmin = false;
  filterForm: FormGroup = new FormGroup({
    businessId: new FormControl(),
    product: new FormControl(),
    posId: new FormControl()
  });
  @ViewChild('gmap') gmapElement: any;

  mapTypes = [
    google.maps.MapTypeId.HYBRID,
    google.maps.MapTypeId.ROADMAP,
    google.maps.MapTypeId.SATELLITE,
    google.maps.MapTypeId.TERRAIN
  ];

  map: MapRef;
  bounds: google.maps.LatLngBounds;
  markerClusterer: MarkerCluster;
  businessVsProducts: any[];

  posIdOptions: string[] = ['One', 'Two', 'Three'];
  filteredPosIdOptions: Observable<string[]>;
  SYS_ADMIN = 'SYSADMIN';





  constructor(
    private reportService: reportsService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
    ) {
      this.translationLoader.loadTranslations(english, spanish);
  }



  ngOnInit() {
    this.isSystemAdmin = this.keycloakService.getUserRoles(true).includes(this.SYS_ADMIN);
    this.initMap();

    this.reportService.getBusinessAndProducts$()
    .pipe(
      map(r => JSON.parse(JSON.stringify(r))),
      tap(r => console.log(r))
    )
    .subscribe(result => this.businessVsProducts = result, err => {}, () => {});

    this.reportService.getPosItems$('businessId', 'recarga_civica', null )
    .pipe(
      map(r => JSON.parse(JSON.stringify(r))),
      tap(r => console.log(r))
    )
    .subscribe(result => this.businessVsProducts = result, err => {}, () => {});

    this.filteredPosIdOptions = this.filterForm.get('posId').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filterForm.get('businessId').valueChanges
    .pipe(
      startWith(null),
      tap(buId => this.updateAvailableProducts(buId))
    ).subscribe(result => this.businessVsProducts = result, err => {}, () => {});

    this.reportService.getBusinessAndProducts$()
    .pipe(
    )
    .subscribe(result => this.businessVsProducts = result, err => {}, () => {});


    this.filterForm.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith({
        businessId: null,
        product: null,
        posId: null
      })
    )
    .subscribe((change) => {console.log(change); }, err => {}, () => {});
  }


  ngOnDestroy() {
  }

  initMap() {
    const mapOptions = {
      center: new google.maps.LatLng(6.1701312, -75.6058417),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new MapRef(this.gmapElement.nativeElement, mapOptions);
  }

  showFilterForm(){
    console.log(this.filterForm);
  }

  updateAvailableProducts(businessId) {
    (businessId)
      ? this.businessVsProducts = this.businessVsProducts.find(e => businessId === businessId).products
      : this.businessVsProducts = this.businessVsProducts.reduce((acc, item) => { acc.push(...item.products); return acc; }, []);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.posIdOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

}
