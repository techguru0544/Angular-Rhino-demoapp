/*
 *  @Project:        Demo
 *  @File:           Demo.auth.service.ts
 *  @Description:    The authentication service class of Demo.
 *  @Created:        08 Apr 2019
 *  @CreatedBy :     
 */

import { OnDestroy } from "@angular/core";
import { DemoBaseService } from "app/core/base/Demo.base.service";
import { DemoSuccess } from "app/core/models/Demo.success.class";
import { DemoHttpClient } from "app/core/services/Demo.http.service";
import { IDemoJSON } from "app/core/interfaces/Demo.json.interface";
import { DemoUser } from "app/core/models/Demo.user.model";
import { DemoURLEnum } from "app/core/enum/Demo.url.enum";
import { DemoStorageItemEnum } from "app/core/enum/Demo.storage.item.enum";
import { DemoHTTPMethodEnum } from "app/core/enum/Demo.http.method.enum";
import { plainToClass } from "class-transformer";

/**
 * The authentication service class of Demo.
 */
export class DemoAuthService extends DemoBaseService implements OnDestroy {
  /**
   * clean subscriptions, intervals, etc
   */
  public ngOnDestroy(): void {
    this.log("DemoAuthService.ngOnDestroy");
  }

  /**
   * Constructor function of DemoAuthService class
   */
  constructor(DemoHttp: DemoHttpClient) {
    super(DemoHttp);
  }

  /**
   * It returns whether user is logged in. If user is authenticated, it must have a valid token that is stored in local storage.
   * @returns {boolean}
   */
  public isLoggedIn(): boolean {
    let returnValue: boolean;
    returnValue = false;
    const token: string | null = this.getLocalStorageItem(
      DemoStorageItemEnum.TOKEN,
    );
    if (token != null && token !== undefined && token.trim().length > 0){
      returnValue = true;
    }
    return returnValue;
  }

  /**
   * It authenticates the user
   * @param {string} userId
   * @param {string} password
   * @param {string} entityId
   * @returns {Promise<DemoUser>}
   */
  public login(userId: string, password: string, entityId: string, activeProfiles?: string[], selectedProfiles?: string[]): Promise<DemoUser> {
    const formData: URLSearchParams = new URLSearchParams();

    formData.append("userid", userId);
    formData.append("password", password);
    formData.append("entityid", entityId);

    if (activeProfiles !== undefined) {
      formData.append(`activeProfiles`, JSON.stringify(activeProfiles));
    }

    if (selectedProfiles !== undefined) {
      formData.append(`selectedProfiles`, JSON.stringify(selectedProfiles));
    }
    
    return new Promise((resolve, reject) => {
      this.rest(DemoHTTPMethodEnum.POST_ZEUS, DemoURLEnum.ZEUS_LOGIN, formData, {}).subscribe(
        (res: DemoSuccess) => {
          if (res.success) {
            const result: DemoSuccess = res;
            const data: IDemoJSON[] = result.data;
            const reason: DemoUser = JSON.parse(JSON.stringify(data[0]));
            reason.multiprofile = res.values.multiprofile;
            if (reason.multiprofile) {
              this.setLocalStorageItem(DemoStorageItemEnum.USER_PASSWORD, btoa(password));
            }
            /* tslint:disable-next-line: custom-comment */
            // @ts-ignore
            const token: string = res.values.token;
            this.setLocalStorageItem(DemoStorageItemEnum.TOKEN, token);
            resolve(reason);
          } else {
            const result: DemoSuccess = res;
            reject(result);
            /** throw result; */
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  /**
   * It creates the user
   * @param {string} name
   * @param {string | number} email
   * @returns {Promise<DemoUser>}
   */
  public signup(name: string, email: string | number, logintype: number): Promise<string> {
    const formData: URLSearchParams = new URLSearchParams();

    formData.append("name", name);
    formData.append("identity", email.toString());
    formData.append("logintype", logintype.toString());

    return new Promise((resolve, reject) => {
      this.rest(DemoHTTPMethodEnum.POST_ZEUS, DemoURLEnum.ZEUS_SIGNUP, formData, {}).subscribe(
        (res: DemoSuccess) => {
          if (res.success) {
            const result: DemoSuccess = res;
            const data: IDemoJSON[] = result.data;

            /** set auth token: */
            this.setLocalStorageItem(DemoStorageItemEnum.TOKEN, (data[0].Workflow_Step_Signup_CreateTemporary_Token as DemoSuccess).values.token);
            
            const exeUrl: string = ((data[0].Workflow_Step_Signup_Shortcut_Exe as DemoSuccess).values as unknown as {ShortcutExe: string}).ShortcutExe;
            resolve(exeUrl);
          } else {
            const result: DemoSuccess = res;
            reject(result);
            /** throw result; */
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  /**
   * It sets the password for user
   * @param {string} password
   * @returns {Promise<DemoUser>}
   */
  public setPassword(password: string): Promise<string> {
    const formData: URLSearchParams = new URLSearchParams();

    formData.append("password", password);

    return new Promise((resolve, reject) => {
      this.rest(DemoHTTPMethodEnum.POST_ZEUS, DemoURLEnum.ZEUS_RESET_PASSWORD, formData, {}).subscribe(
        (res: DemoSuccess) => {
          if (res.success) {
            const result: DemoSuccess = res;
            const data: IDemoJSON[] = result.data;
            const identity: string = ((data[0].Workflow_Step_Contact_Password_Updated as DemoSuccess).values as unknown as {identity: string}).identity;
            resolve(identity);
          } else {
            const result: DemoSuccess = res;
            reject(result);
            /** throw result; */
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  }
}
