/*
 *  @Project:        Demo
 *  @File:           Demo.address.model.ts
 *  @Description:    This model represents a address model.
 *  @Created:        19 August 2019
 *  @CreatedBy:      
 */

import { DemoBaseModel } from "../base/Demo.base.model";

/**
 * This model represents a address model.
 */
export class DemoAddressModel extends DemoBaseModel {

  constructor() {
    super();
    
    this.labelid = 0;
    this.addressType = "",
    this.address = "";
    this.buildingname = "";
    this.latitude_decimal = "";
    this.longitude_decimal = "";
    this.location = "";
    this.sitecountry = "";
    this.siteline1 = "";
    this.siteline2 = "";
    this.siteline3 = "";
    this.sitepostcode = "";
    this.sitestate = "";
    this.sitesuburb = "";
    this.sublocation = "";
    this.territory = "";
    this.updatedLatitude = "";
    this.updatedLongitude = "";
    this.rownumber = 0;
  }

  /**
   * labelid
   */
  public labelid: number;

  /**
   * address
   */
  public address: string;

  /**
   * addressType
   */
  public addressType: string;

  /**
   * buildingname
   */
  public buildingname: string;

  /**
   * latitude_decimal
   */
  public latitude_decimal: string;

  /**
   * longitude_decimal
   */
  public longitude_decimal: string;

  /**
   * updatedLatitude
   */
  public updatedLatitude: string;

  /**
   * updatedLongitude
   */
  public updatedLongitude: string;

  /**
   * location
   */
  public location: string;

  /**
   * sitecountry
   */
  public sitecountry: string;

  /**
   * siteline1
   */
  public siteline1: string;

  /**
   * siteline2
   */
  public siteline2: string;

  /**
   * siteline3
   */
  public siteline3: string;

  /**
   * sitepostcode
   */
  public sitepostcode: string;

  /**
   * sitestate
   */
  public sitestate: string;

  /**
   * sitesuburb
   */
  public sitesuburb: string;

  /**
   * sublocation
   */
  public sublocation: string;

  /**
   * territory
   */
  public territory: string;

  /**
   * rownumber
   */
  public rownumber: number;
}
