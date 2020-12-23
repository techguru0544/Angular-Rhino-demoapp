/*
 *  @Project:        Demo
 *  @File:           Demo.generic.field.map.component.ts
 *  @Description:    The generic field map of Demo.
 *  @Created:        21 Dec 2019
 *  @CreatedBy:      
 */

import { Component, ViewEncapsulation, OnInit, ViewChild } from "@angular/core";
import { DemoGenericFieldModel } from "app/core/models/Demo.generic.field.model";
import { DemoUser } from "app/core/models/Demo.user.model";
import { Observable, range } from "rxjs";
import { DemoBaseGenericFieldCustomComponent } from "../../../../../../core/base/Demo.base.generic.field.custom.component";
import { IDemoJSON } from "../../../../../../core/interfaces/Demo.json.interface";
import { DemoPage } from "../../../../../../core/models/Demo.page.model";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/toArray";
import { environment } from "./../../../../../../../environments/environment";

/**
 * The generic field map of Demo.
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "Demo-map",
  styleUrls: ["./Demo.generic.field.map.component.scss"],
  templateUrl: "./Demo.generic.field.map.component.html",
})

export class DemoGenericFieldMapComponent extends DemoBaseGenericFieldCustomComponent implements OnInit {

  /**
   * latitude decimal value of job
   */
  public latitudeDecimal: number = -33.8688;

  /**
   * longitude decimal value of job
   */
  public longitudeDecimal: number = 151.2093;

  /**
   * google map
   */
  /* tslint:disable-next-line: no-any */
  @ViewChild("map", { static: true }) public mapElement: any;

  /**
   * google map value intialize
   */
  public map!: google.maps.Map;

  /**
   * DemoPage.
   * @type {DemoPage}
   */
  public page: DemoPage = new DemoPage();

  /** rowData array used to store job fetched data */
  public rowData: IDemoJSON[] = [];

  /** Custom marker icon base url */
  public iconBase: string = "http://maps.google.com/mapfiles/ms/icons/";

  /** currentPage used for set first page of paginations */
  public currentPage: number = 0;

  /** totalPages used for total page number of paginations */
  public totalPages: number = 0;

  /** limit used for set limit of paginations */
  public limit: number = 20;

  /** size used for set size of paginations */
  public size: number = 0;

  /** rangeNumber used for get pages for paginations */
  public rangeNumber: number = 3;

  /** pages used for list of paginations */
  public pages!: Observable<number[]>;

  /** offset used for set offset of paginations */
  public offset: number = 0;

  /** queryname used for set query type of WS */
  public queryname: string = "";

  /** min_lat is used for minimum latitude for getting locations data */
  public min_lat: number = -90;

  /** max_lat is used for maximum latitude for getting locations data */
  public max_lat: number = 90;

  /** min_lng is used for minimum longitude for getting locations data */
  public min_lng: number = -180;

  /** max_lng is used for minimum longitude for getting locations data */
  public max_lng: number = 180;

  /**
   * Array for list of all icons url with color
   */
  public iconBaseArray: IDemoJSON = {};

  /** map marker array */
  public markers: google.maps.Marker[] = [];

  /**
   * isLocationsGetWSRun used for check get locations data WS is running or not
   */
  public isLocationsGetWSRun: boolean = false;

  /**
   * The generic field map of Demo.
   */
  constructor(
  ) {
    super();
    this.page.pageNumber = 0;
    this.iconBaseArray = {
      green: {
        url: `${this.iconBase}green-dot.png`,
      },
      red: {
        url: `${this.iconBase}red-dot.png`,
      },
      blue: {
        url: `${this.iconBase}blue-dot.png`,
      },
      yellow: {
        url: `${this.iconBase}yellow-dot.png`,
      },
      purple: {
        url: `${this.iconBase}purple-dot.png`,
      }
    };
  }

  /**
   * This function is called when the component loaded.
   */
  public ngOnInit(): void {
    const fieldGeneric: DemoGenericFieldModel = this.field as DemoGenericFieldModel;
    this.queryname = fieldGeneric.data.query_name as string;
    this.initGoogleMap();
  }

  /**
   * This function is used for getting location data for map
   */
  public getLocationGridBounds(): void {  
    const loggedUser: DemoUser = this.DemoService.getLoggedInUser();
    if (this.currentPage > 0) {
      this.page.pageNumber = this.currentPage - 1;
    }
    const formData: URLSearchParams = new URLSearchParams();
    formData.append("customerid", loggedUser.customerid.toString());
    formData.append("min_lat", this.min_lat.toString());
    formData.append("max_lat", this.max_lat.toString());
    formData.append("min_lng", this.min_lng.toString());
    formData.append("max_lng", this.max_lng.toString());
    formData.append("page", this.page.pageNumber.toString());
    formData.append("size", this.limit.toString());
    this.DemoService.getGenericQueryModalData(this.queryname, formData).then((pagedData) => {
      this.clearAllMarker();
      this.isLocationsGetWSRun = false;
      this.rowData = pagedData.data as unknown as IDemoJSON[];
      this.totalPages = pagedData.page.totalPages;
      this.size = pagedData.page.totalElements;
      this.limit = pagedData.page.size;

      this.getPages(this.offset, this.limit);

      this.setMarkerOnMap();
    }).catch((reason) => {
      throw reason;
    });
  }

  /**
   * This function is used for implement google map 
   */
  public initGoogleMap(): void {
    if (typeof(google) !== "undefined"){
      const jobLatlng: google.maps.LatLng = new google.maps.LatLng(this.latitudeDecimal, this.longitudeDecimal);
      const mapProperties: Object = {
        center: jobLatlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
      this.setSearchBoxOnMap();
    }
  }

  /**
   * This function used for set multiple marker on map with custom icon
   */
  public setMarkerOnMap(): void {
    this.markers = [];

    for (let i: number = 0; i < this.rowData.length; i = i + 1) {      
      const position: google.maps.LatLng = new google.maps.LatLng(this.rowData[i].gps_latitude as number, this.rowData[i].gps_longitude as number);
      const iconURLObj: { url: string } = this.iconBaseArray[this.rowData[i].marker as string] as { url: string } ;
      const marker: google.maps.Marker = new google.maps.Marker({
        position: position as google.maps.LatLng,
        icon: iconURLObj.url as unknown as google.maps.ReadonlyIcon,
        map: this.map,
      });
      this.markers.push(marker);
    }
  }

  /**
   * This function is used for clear all marker from map
   */
  public clearAllMarker(): void {
    this.markers.forEach((item) => {
      if (item) {
        item.setMap(null);
      }
    });
  }

  /**
   * This funtions used for set searchbox on map screen
   */
  public setSearchBoxOnMap(): void {
    /* Create the search box and link it to the UI element. */
    const input: HTMLInputElement = document.getElementById("pac-input") as HTMLInputElement;
    if (google.maps.places !== undefined) {
      const searchBox: google.maps.places.SearchBox = new google.maps.places.SearchBox(input);
      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

      /* Bias the SearchBox results towards current map's viewport. */
      this.map.addListener("bounds_changed", () => {
        /* input.value = ""; */
        searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
        this.getLocationDataOnBoundsChanged();
      });

      searchBox.addListener("places_changed", () => {
        const places: google.maps.places.PlaceResult[] = searchBox.getPlaces();
        
        if (places.length === 0) {
          return;
        }

        this.clearAllMarker();
        this.markers = [];

        const bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();
        places.forEach((place: google.maps.places.PlaceResult) => {
          if (place.geometry) {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          }
        });
        this.map.fitBounds(bounds);
      });
    }
  }

  /**
   * This function is used for get locations data based on changed bounds data
   */
  public getLocationDataOnBoundsChanged(): void {
    const bounds: google.maps.LatLngBounds | null | undefined = this.map.getBounds();
    if (bounds && bounds !== undefined && bounds !== null) {
      const ne: google.maps.LatLng = bounds.getNorthEast();
      const sw: google.maps.LatLng = bounds.getSouthWest();
      this.max_lat = ne.lat();
      this.min_lat = sw.lat();
      this.max_lng = ne.lng();
      this.min_lng = sw.lng();
      if (!this.isLocationsGetWSRun) {
        this.isLocationsGetWSRun = true;
        this.currentPage = 0;
        this.offset = 0;
        this.getLocationGridBounds();
      }
    }
  }

  /** Used for get current page */
  public getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  /** Used for get page numbers */
  public getPages(offset: number, limit: number): void {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.pages =  range(-this.rangeNumber, this.rangeNumber * 2 + 1)
      .map((offsetNew: number) => this.currentPage + offsetNew)
      .filter((page: number) => this.isValidPageNumber(page, this.totalPages))
      .toArray();    
  }

  /** Used for given page number is valid or not */
  public isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  /** This function called when any page changes */
  public selectPage(page: number, event: MouseEvent): void {    
    event.preventDefault();
    if (this.isValidPageNumber(page, this.totalPages)) {
      this.offset = (page - 1) * this.limit;  
      this.currentPage = this.getCurrentPage(this.offset, this.limit);
      this.isLocationsGetWSRun = true;
      this.getLocationGridBounds();
    }
  }
}
