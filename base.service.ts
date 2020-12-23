/*
 *  @Project:        Demo
 *  @File:           base.service.ts
 *  @Description:    The base service of App. All services will be extending from this base.
 *  @Created:        08 Apr 2019
 *  @CreatedBy :     
 */

import { HttpHeaders, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { String } from "typescript-string-operations";
import { DemoHttpClient } from "../services/Demo.http.service";
import { DemoStorageItemEnum } from "../enum/Demo.storage.item.enum";
import { DemoURLEnum } from "../enum/Demo.url.enum";
import { DemoSuccess } from "../models/Demo.success.class";
import { environment } from "../../../environments/environment";
import { DemoRequestOptions } from "../http/Demo.http.request";
import { DemoHTTPMethodEnum } from "../enum/Demo.http.method.enum";
/**
 * This is a base class of services
 */
export class DemoBaseService {
  
  /**
   * base url, it will be set from environment.
   */
  private baseUrl: string;
  
  /**
   * Constructor function of DemoBaseService class
   * @param {DemoHttpClient} httpClientService
   */
  constructor(private httpClientService: DemoHttpClient) {
    this.baseUrl = String.Format("{0}/{1}", environment.BASE_URL, environment.WS_URL);
  }
  
  /**
   * It returns a value for a given key.
   * @param {DemoStorageItemEnum} key
   * @returns {string | null}
   */
  protected getLocalStorageItem(key: DemoStorageItemEnum): string | null {
    return localStorage.getItem(key);
  }
  
  /**
   * It sets the value in local storage
   * @param {DemoStorageItemEnum} key
   * @param {string} value
   */
  protected setLocalStorageItem(key: DemoStorageItemEnum, value: string): void {
    localStorage.setItem(key, value);
  }
  
  /**
   * It removes the key from local storage
   * @param {DemoStorageItemEnum} key
   */
  protected removeLocalStorage(key: DemoStorageItemEnum): void {
    localStorage.removeItem(key);
  }
  
  /**
   * This function returns the
   * @param {DemoURLEnum} DemoURL
   * @returns {string}
   */
  public getURL(DemoURL: DemoURLEnum): string {
    let DemoURL: string = DemoURL.toString();
    let returnURL: string = String.Format("{0}/{1}", this.baseUrl, DemoURL);    
    return returnURL;
  }

  /**
   * This function returns the
   * @param {DemoURLEnum} DemoURL
   * @returns {string}
   */
  public getBaseURL(): string {
    return environment.BASE_URL;
  }
  
  /**
   * This functions logs the message in console.
   * @param {string} message
   * @param optionalParams
   */
  public log(message?: string | any[], ...optionalParams: any[]): void {
    this._logMessage = message + "<br>"+ this._logMessage ;
    this._logMessage = optionalParams+ "<br>"+ this._logMessage;
  
    if (this._logMessage.length > 100000) {
      this._logMessage = this._logMessage.substring(0, 100000);
    }
  }
  
  /* logmessage */
  private _logMessage = "";
  
  /**
   * getLog.
   * @returns {string}
   */
  public getLog(){
      return this._logMessage;
  }
  
  /**
   * This functions logs the object in console.
   * @param optionalParams
   */
  public logObject(...optionalParams: any[]): void {
    console.log(optionalParams);
  }
  
  /**
   * IsNullorEmpty.
   * @param str
   * @returns {boolean}
   * @constructor
   */
  public IsNullorEmpty(str: any): boolean
  {
    if( str === undefined || typeof str == "undefined" ){
      return true;
    }
  
    if( str === null ){
      return true;
    }
  
    if( str.toString().trim().length === 0 ){
      return true;
    }
    
    return false;
  }
  
  /* tslint:enable */

  /**
   * Rest params
   * @param {DemoHTTPMethodEnum} DemoHttpMethod
   * @param {DemoURLEnum} DemoURL
   * @param {DemoParams} DemoParams
   * @param {IRequestOptions} options
   * @returns {Observable<DemoSuccess>}
   */
  protected rest(DemoHttpMethod: DemoHTTPMethodEnum, DemoURL: DemoURLEnum, formData: URLSearchParams, options: DemoRequestOptions): Observable<DemoSuccess> {
    let message: string;
    message = "";
    
    let url: string;
    url = this.getURL(DemoURL);
    
    /** override as only accept json */
    options.responseType = "json";
    
    /** if there is url suffix, add this to url */
    if (options.urlSuffix != null && options.urlSuffix !== "") {
      url = url + options.urlSuffix;
    }
    
    const token: string | null = this.getLocalStorageItem(DemoStorageItemEnum.TOKEN);
    let key: string = String.Format("Bearer {0}", token);
    /** if token is null return */
    let requiresAuthToken: boolean = true;

    if (DemoURL === DemoURLEnum.ZEUS_LOGIN || DemoURL === DemoURLEnum.ZEUS_FORGOT_PASSWORD || DemoURL === DemoURLEnum.ZEUS_SIGNUP || DemoURL === DemoURLEnum.ISSUE_REPORT) {
      requiresAuthToken = false;
    }

    if (requiresAuthToken && token === null) {
      return new Observable<DemoSuccess>();
    }
    
    let contentType: string = "application/json";   

    if (options.customURL != null && options.customURL !== "") {
      url = `/${options.customURL}`;
    }
    
    const header: HttpHeaders = new HttpHeaders({
      Authorization: key,
      "Content-Type": contentType,
    });
    
    const option: Object = {
      headers: header,
    };
    
    this.log(String.Format("Rest: {0}", DemoURL));
    
    return new Observable((observer) => {
      let observable: Observable<DemoSuccess>;
      
      switch (DemoHttpMethod) {
        case DemoHTTPMethodEnum.POST:
          const postBody: HttpParams = new HttpParams({
            fromString: formData.toString(),
          });
          observable = this.httpClientService.post<DemoSuccess>(url, postBody, option);
          
          break;
        
        case DemoHTTPMethodEnum.POST_ZEUS:
          const headersPostZeus: HttpHeaders = new HttpHeaders()
          .set("Content-Type", contentType)
          .set("Authorization", key);
          /* tslint:disable-next-line: no-any */
          const paramsPostZeus: any = {};
          formData.forEach((value, name) => {
            paramsPostZeus[name] = value;
          });

          observable = this.httpClientService.post<DemoSuccess>(url, paramsPostZeus, { headers: headersPostZeus });
          break;

        case DemoHTTPMethodEnum.GET:
          const params: HttpParams = new HttpParams({
            fromString: formData.toString(),
          });
          observable = this.httpClientService.get<DemoSuccess>(url, { params, headers: header });
          
          break;
        
        case DemoHTTPMethodEnum.PUT:
          const headersPut: HttpHeaders = new HttpHeaders()
          .set("Content-Type", "application/json")
          .set("Authorization", key);
          /* tslint:disable-next-line: no-any */
          const paramsPut: any = {};
          formData.forEach((value, name) => {
            /* tslint:disable-next-line: no-any */
            paramsPut[name] = value;
          });
          
          observable = this.httpClientService.put<DemoSuccess>(url, paramsPut, { headers: headersPut });
          break;
        
        case DemoHTTPMethodEnum.DELETE:
          observable = this.httpClientService.delete<DemoSuccess>(url, { headers: header });
          
          break;
        
        default:
          return;
      }
      
      observable.pipe(map((response: DemoSuccess) => response))
      .subscribe(
      (value) => {
        /** 1 - NULL Check */
        if (value === null) {
          /** throw new Error(String.Format("Response cannot be null. (JTMHttpService.post) URL: {0}", url)); */
          observer.next(value);
        }
        
        /** 2 - RETURN Type Check */
        if (!value.success) {
          
          /** return value cannot be FALSE, so throw the given error message to whoever call here */
          if (value.message != null) {
            message = message + value.message;
          }
  
          if (message === "") {
            message = value.toString();
          }

          
          /** throw new Error(message); */
          observer.error(value);
          throw new Error(message);
        }
        
        /** if it is successful, send it to subscribers */
        if (value.success) {
          observer.next(value);
        }
        
        observer.complete();
      },
      (error: HttpErrorResponse) => {
        if (DemoURL !== DemoURLEnum.ZEUS_LOGIN) {
          if (error.status === 498) {
            this.httpClientService.logout();
          }
        }
        observer.error(error.error);
        throw new Error(message);
        observer.complete();
      });
    });
  }
}
