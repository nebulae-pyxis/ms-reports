import { KeycloakService } from 'keycloak-angular';
import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { ReportsService } from './pos-coverage-report.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { MapRef } from './entities/agmMapRef';
import { MarkerCluster } from './entities/markerCluster';
import { MarkerRef, MarkerRefInfoWindowContent, MarkerRefTitleContent, PosPoint } from './entities/markerRef';
import { of, combineLatest, Observable, forkJoin, concat, from, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, tap, map, mergeMap } from 'rxjs/operators';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'reports',
  templateUrl: './pos-coverage-report.component.html',
  styleUrls: ['./pos-coverage-report.component.scss'],
  animations: fuseAnimations
})
export class PosCoverageReportComponent implements OnInit, OnDestroy {

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
  SYS_ADMIN = 'SYSADMIN';

  productOpstions: string[];

  subscriptions: Subscription[] = [];

  markers: MarkerRef[] = [];
  selectedMarker: MarkerRef;


  constructor(
    private reportService: ReportsService,
    private translationLoader: FuseTranslationLoaderService,
    public snackBar: MatSnackBar,
    private keycloakService: KeycloakService
    ) {
      this.translationLoader.loadTranslations(english, spanish);
  }

  ngOnInit() {
    this.initMap();

    this.isSystemAdmin = this.keycloakService.getUserRoles(true).includes(this.SYS_ADMIN);

    this.subscriptions.push(
      this.filterForm.get('businessId').valueChanges
      .pipe(
        tap( newSelectedBusinessId => {
          this.productOpstions =
            (this.isSystemAdmin && newSelectedBusinessId == null)
              ? this.businessVsProducts.reduce((acc, item) => {
                acc.push(...item.products); return acc;
              }, [])
              : this.businessVsProducts.find(e => e.businessId === newSelectedBusinessId).products;
          this.productOpstions = this.productOpstions.filter(this.onlyUnique);
          if (!this.productOpstions.includes(this.filterForm.get('product').value)){
            this.filterForm.get('product').setValue(null);
          }
          this.filterForm.get('posId').setValue(null);
        })
      )
      .subscribe(r => {}, error => console.error(), () => {})
    );


  concat(

    of(this.keycloakService.getUserRoles(true).includes(this.SYS_ADMIN))
    .pipe(
      tap((isSysAdm) => this.isSystemAdmin = isSysAdm )
    ),

    this.reportService.getBusinessAndProducts$()
    .pipe(
      map(r => JSON.parse(JSON.stringify(r))),
      map((result: any[]) => result.reduce((acc, item) => {
        acc.push({ businessName: item.name, businessId: item._id, products: item.products });
        return acc;
      }, [])),
      map( (businessOptions: any[]) => {
        if (this.isSystemAdmin){
          businessOptions.push({ businessName: 'ALL-TODAS', businessId: null, products: [] });
        }
        return businessOptions;
      }),
      tap(r => console.log('this.reportService.getBusinessAndProducts$()', r)),
      tap(r => this.businessVsProducts = r )
    )

  )
  .subscribe(r => {}, err => {}, () => {});


    this.filterForm.get('businessId').valueChanges
    .pipe(
      startWith(null),
      tap(buId => this.updateAvailableProducts(buId))
    ).subscribe(result => this.businessVsProducts = result, err => {}, () => {});


    this.filterForm.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith({
        businessId: null,
        product: null,
        posId: null
      }),
      tap(r => console.log('FILTERS CHANGED ==> ', r)),
      mergeMap(filters => this.reportService.getPosItems$(filters.businessId, filters.product, filters.posId)),
      map(r => JSON.parse(JSON.stringify(r))),
      tap(r => console.log('this.reportService.getPosItems$', JSON.stringify(r) )),
      mergeMap(posList => this.drawPosList$(posList) )
    )
    .subscribe(() => {}, err => console.error(err), () => {});
  }

  drawPosList$(posList: any[]){
    return from(posList)
    .pipe(
      map((p) => new MarkerRef(
        new PosPoint(p._id, p.lastUpdate, p.businessId, p.products,  p.pos.userName, p.location ),
        {
          position: {
            lat: parseFloat(p.location.coordinates.lat),
            lng: parseFloat(p.location.coordinates.long)
          }, map: null
        }
        )),
      tap(marker => marker.setMap(this.map)),
      tap(marker => this.addMarkerToMap(marker))
    );
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initMap() {
    const mapOptions = {
      center: new google.maps.LatLng(6.1701312, -75.6058417),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new MapRef(this.gmapElement.nativeElement, mapOptions);
  }

   /**
   * Adds a marker to the map and configure observables to listen to the events associated with the marker (Click, etc)
   * @param marker marker to be added
   */
  addMarkerToMap(marker: MarkerRef) {
    marker.inizialiteEvents();
    marker.clickEvent.subscribe(event => {
      this.onMarkerClick(marker, event);
    });

    this.markers.push(marker);
  }

  /**
   * Opens the infoWindow of the clicked marker and closes the other infoWindows in case that these were open.
   * @param marker clicked marker
   * @param event Event
   */
  onMarkerClick(marker: MarkerRef, event) {
    this.selectedMarker = marker;
    this.markers.forEach(m => {
      m.infoWindow.close();
      m.setAnimation(null);
    });
    marker.setAnimation(google.maps.Animation.BOUNCE);
    marker.setAnimation(null);
    marker.infoWindow.open(this.map, marker);
  }

  showFilterForm(){
    console.log(this.filterForm);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  updateAvailableProducts(businessId) {
    (businessId)
      ? this.businessVsProducts = this.businessVsProducts.find(e => businessId === businessId).products
      : this.businessVsProducts = this.businessVsProducts.reduce((acc, item) => { acc.push(...item.products); return acc; }, []);
  }


}
