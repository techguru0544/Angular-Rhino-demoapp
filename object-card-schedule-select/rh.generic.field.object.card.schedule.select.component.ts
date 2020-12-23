/*
 *  @Project:        Demo
 *  @File:           Demo.generic.field.object.card.schedule.select.component.ts
 *  @Description:    This component is used as object card schedule select component in generic form.
 *  @Created:        02 Dec 2020
 *  @CreatedBy:      
 */

import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from "@angular/core";
import { DemoBaseGenericFieldCustomComponent } from "app/core/base/Demo.base.generic.field.custom.component";
import { DemoGenericFieldModel } from "app/core/models/Demo.generic.field.model";
import { DemoTimePipe } from "app/core/pipes/Demo.time.pipe";
import { DemoDatePipe } from "app/core/pipes/Demo.​date.pipe";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { AbstractControl } from "@angular/forms";
import { environment } from "environments/environment";
import { DemoStorageItemEnum } from "app/core/enum/Demo.storage.item.enum";
import { String } from "typescript-string-operations";
import { MatDialogRef } from "@angular/material/dialog";
import { DemoGenericFieldScheduleSelectModalBoxComponent } from "../../schedule-select-modalbox/Demo.generic.field.schedule.select.modalbox.component";
import { IDemoJSON } from "app/core/interfaces/Demo.json.interface";
import { Subscription } from "rxjs";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DemoExternalActionSuccess } from "app/core/models/Demo.external.action.model";
import { DemoDialogTypeEnum } from "app/core/enum/Demo.dialog.type.enum";
import { DemoExternalActionValue } from "app/core/models/Demo.external.action.value.model";
import { DemoGenericFormMode } from "../../../../../../core/enum/Demo.generic.form.mode.enum";
import { IDemoDateFormatConfig } from "app/core/interfaces/Demo.dateformatconfig.interface";
import * as moment from "moment";
import { DatePipe } from "@angular/common";

export const MY_FORMATS: IDemoDateFormatConfig = {
  parse: {
    dateInput: "input",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "DD/MM/YYYY",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

/**
 * The generic field colorpicker component of Demo.
 */
@Component({
  selector: "Demo-generic-field-object-card-schedule-select",
  templateUrl: "./Demo.generic.field.object.card.schedule.select.component.html",
  styleUrls: ["./Demo.generic.field.object.card.schedule.select.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    DemoTimePipe,
    DemoDatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DemoGenericFieldScheduleSelectComponent extends DemoBaseGenericFieldCustomComponent implements OnInit, OnDestroy {

  /** fieldGeneric */
  public fieldGeneric!: DemoGenericFieldModel; 
  
  /** today's date so we don't allow past dates in picker */
  public todayDate: Date = new Date();

  /** The minimum valid date for completion datepicker */
  public minCompDate: Date;

  /** The maximum valid date for completion datepicker */
  public maxCompDate: Date; 

  /** The minimum valid date for attendance datepicker */
  public minRespDate: Date;

  /** The maximum valid date for attendance datepicker */
  public maxRespDate: Date; 

  /** response target datepicker value */
  public responseTargetDatepicker!: Date;
  
  /** completion target datepicker value */
  public completionTargetDatepicker!: Date;

  /** response due time value */
  public responseDueTime!: string;

  /** completionDueDate  value */
  public completionDueDate!: string;

  /** attendaceDueDate  value */
  public attendaceDueDate!: string;

  /**
   *  external externalAction
   */
  protected externalAction!: DemoExternalActionSuccess;  

  /** fieldName */
  public fieldName: string = "";

  /** is this field open for edit? */
  public isOpenForEdit: boolean = false;

  /**
   * falcon page url for showing falcon's page in Demo
   */
  public falconPageUrl: string = "";
  
  /**
   * falcon page url for showing falcon's page in Demo
   */
  public falconPageUrlParams: string = "";

  /** data from other forms */
  public formsData: IDemoJSON = {};

  /**
   * isGetCompletionDateData used for check if get completion date data WS running or not
   */
  public isGetCompletionDateData: boolean = false;

  /**
   * job changed subscription
   */
  public changedJobSubscription!: Subscription; 

  /** model data used for this component (used for this component fields object) */
  public modelData: { [key: string]: string } = {};

  /** model options used for the set select modal propery */
  public modalOptions: { [key: string]: string } = {};

  constructor() {
    super();

    const currentYear: number = new Date().getFullYear();
    this.minCompDate = new Date();
    this.maxCompDate = new Date(currentYear + 5, 11, 31); 
    this.minRespDate = new Date();
    this.maxRespDate = new Date(currentYear + 5, 11, 31);

    this.changedJobSubscription = this.DemoService.objectCardJobChanged.subscribe((res) => {
      if (!this.isGetCompletionDateData) {
        this.isGetCompletionDateData = true;
        this.getCompletionDateData(res);
      }
    });
  }

  /**
   * This function is called when the component loaded.
   */
  public ngOnInit(): void {
    if (this.field !== null && this.field.key !== undefined) {
      this.fieldName = this.field.key.toString();
      this.fieldGeneric = this.field as DemoGenericFieldModel;
    }

    this.formsData = this.DemoService.getLoadedFormsData();

    const fieldGeneric: DemoGenericFieldModel = this.field as DemoGenericFieldModel;

    this.modalOptions = fieldGeneric.getModelOptions();    

    if (this.modalOptions.dateformat) {
      MY_FORMATS.display.dateInput = this.modalOptions.dateformat;
    }
    
    /** set default values for form control if its open for edit */
    if (this.formsData.jobid !== undefined && this.formsData.jobid > 0) {
      this.isOpenForEdit = true;
    }
    this.DemoService.log("form", this.form);
    super.onInitialized();
    
    /** Load initial data */
    if (Object.keys(this.formsData).length > 0) {
      this.modelData.responseduedate = this.formsData.attendbydate as string;
      this.modelData.responseduetime = this.formsData.attendbytime as string;
      this.modelData.duedate = this.formsData.completebydate as string;
      this.modelData.duetime = this.formsData.completebytime as string;        
    }
  
    this.setFalconPageURL();
  }

 /**
  * On Destroy
  * @returns void
  */
  public ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.changedJobSubscription !== null && this.changedJobSubscription !== undefined) {
      this.changedJobSubscription.unsubscribe();
    }
  }

  /** this function is used when any change occurs in data */
  public onChange(): void {
    const formData: { [key: string]: string } = this.getValue();
    for (const item of Object.keys(formData)) {
      if (formData.item !== "") {
        this.model[item] = formData[item];
      }
    }
  
    if (this.model.schedule_select !== undefined) {
      delete this.model.schedule_select;
    }

    this.DemoService.log("onChange", this.model);

    this.formControl.setValue(this.model);
    const field: DemoGenericFieldModel = this.field as DemoGenericFieldModel;
    if (this.field.templateOptions && this.field.templateOptions.change) {
      field.multipleKey = true;
      this.field.templateOptions.change(field);
      this.DemoService.log("onChange - field", field);
    }
  }

  /** get field value */
  public getValue(): { [key: string]: string } {
    const datePipe: DatePipe = new DatePipe("en-US");    
    let responseduetime: string | null = this.modelData.responseduetime;
    let duetime: string | null = this.modelData.responseduetime;
    if (this.modalOptions.submittimeformat) {
      const sourceValue: string = String.Format("2000-01-01 {0}", this.modelData.responseduetime);
      responseduetime = datePipe.transform(sourceValue, this.modalOptions.submittimeformat);

      const sourceDueValue: string = String.Format("2000-01-01 {0}", this.modelData.duetime);
      duetime = datePipe.transform(sourceDueValue, this.modalOptions.submittimeformat);
    }
    const value: { [key: string]: string } = {
      attendbydate: moment(this.modelData.responseduedate).format(this.modalOptions.submitdateformat),
      attendbytime: responseduetime as string,
      supplierid: this.modelData.supplierid,
      contactid: this.modelData.contactid,
      completebydate: moment(this.modelData.duedate).format(this.modalOptions.submitdateformat),
      completebytime: duetime as string,      
    };
    return value;
  }

  /**
   * this function will be called from component when the value changed
   */
  public onFieldValueChanged(): void {
    if (this.formMode === DemoGenericFormMode.EDIT) {
      this.DemoService.genericFormJobData = Object.assign(this.DemoService.genericFormJobData, this.getValue());      
    }
    if (this.modelData !== null) {
      this.formControl.setValue(this.getValue());
      const field: DemoGenericFieldModel = this.field as DemoGenericFieldModel;
      if (this.field.templateOptions && this.field.templateOptions.change) {
        field.multipleKey = true;
        this.field.templateOptions.change(field, field);
      }
    } 
  }  

  /** On complex fields changed */
  public onComplexFieldChanged(event: boolean): void {
    if (event) {
      /** do something */
    } else {
      this.showChangeRequest = false;
    }
  }

  /**
   * For setting the time based on the selected quote response date
   */
  public getTime(): string {
    /** todo */
    return "00:00";
  }

  /**
   * isOpenForEditing
   * @returns {boolean}
   */
  public isOpenForEditing(): boolean {
    return this.isOpenForEdit;
  }

  /**
   * Validations for all the controls
   */
  public hasError(key: string, errorKey: string): boolean {
    let returnValue: boolean;
    returnValue = false;
   
    if (this.form != null && this.form.get(key) != null) {
      const control: AbstractControl | null = this.form.get(key);
      if (control != null && control.touched) {
        returnValue = control.hasError(errorKey);
      }
    }
    return returnValue;
  }

  /**
   * This function used to open schedule select modal (Falcon page)
   */
  public openScheduleSelectModal(): void {        
    const value: string = "%"; 
    const selectScheduleRef: MatDialogRef<DemoGenericFieldScheduleSelectModalBoxComponent> = this.DemoService.showModalDialog(DemoGenericFieldScheduleSelectModalBoxComponent, {
      autoFocus: false,
      data: { genericParams: { falconPageUrl: this.falconPageUrl, modalSettingData: this.modalOptions } },
      disableClose: true,
      width: `${this.modalOptions.width.replace("px", "")}${value}`,
      height: `${this.modalOptions.height.replace("px", "")}${value}`,
      panelClass: "generic-form-modal",
    });

    selectScheduleRef.componentInstance.dialogCancel.subscribe((res: object) => {
      if (res !== undefined) {
        /** do nothing */
      }
      selectScheduleRef.close();
    });

    selectScheduleRef.componentInstance.dialogClose.subscribe((res: boolean) => {
      if (res !== undefined) {
        /** do nothing */
      }

      /** check validation of external action */
      if (this.externalAction === null || this.externalAction === undefined) {
        this.DemoService.showAlertDialog(DemoDialogTypeEnum.ERROR, "Error", "Error", "Please select a valid datetime from the calendar.");
        return;
      }

      /** Update component values */
      const externalValue: DemoExternalActionValue = this.externalAction.value;
      this.modelData.supplierid = externalValue.supplierId.toString();
      this.modelData.contactid = externalValue.contactId.toString();
      /** Setup attendance date and time */
      const attendanceDatetime: Date = new Date(externalValue.attendanceDatetime);
      this.modelData.responseduedate = attendanceDatetime.toISOString();
      this.modelData.responseduetime = attendanceDatetime.toLocaleTimeString();
      selectScheduleRef.close();
      this.onFieldValueChanged();
      this.onChange();
    });
  }

  /**
   * setFalconPageURL
   * @param {IDemoDialogData} data
   */
  
  /* tslint:disable-next-line: no-any */
  public setFalconPageURL(): void {
    const url: string = "schedule";
    this.DemoService.log("DemoFalconViewerPageComponent", "setFalconPageURL");
    if (url != null) {
      const token: string | null = localStorage.getItem(DemoStorageItemEnum.TOKEN);
      const unixDateTime: number = new Date().getTime();
      const queryStr: string = String.Format("&datetime={0}&params={1}&schedule_select={2}", unixDateTime, 0, 1);
      this.falconPageUrl = String.Format("{0}?token={3}&redirecturl={1}{2}&id={4}", environment.FALCON_URL, url, queryStr, token);
    }    
  }

  /**
   * When we receive a call from outside component
   * @param {string} value
   */
  @HostListener("window:message", ["$event"])
  public onCallFromOutside(event: MessageEvent): void {
    this.DemoService.log("DemoGenericFieldScheduleSelectComponent.onCallFromOutside", event);    
    try {
      /** receive data from schedule */
      if (event.data != null && event.data !== "") {
        this.DemoService.log("received", event.data);
        this.externalAction  = JSON.parse(event.data);
      }
    } catch (err) {
      /** nothing todo */
    }    
  }

  /**
   * Used for get completion date data from server based on selected job id
   * @param jobid selected job id
   */
  public getCompletionDateData(jobid: number): void {
    this.DemoService.getComplerionDateData(jobid)
    .then((res) => {
      this.modelData.duetime = res.duetime as string;
      this.modelData.duedate = res.duedate as string;
      this.onChange();
      setTimeout(() => {
        this.isGetCompletionDateData = false;
      },         2000);
    }).catch((reason) => {
      throw reason;
    });
  }

  /**
   * On change of Response Due Date
   */
  public onResponseDueDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.modelData.responseduedate = new Date(event.value.toString()).toISOString();
    }
  }

}
