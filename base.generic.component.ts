/*
 *  @Project:        Demo
 *  @File:           base.generic.component.ts
 *  @Description:    The base generic component of Demo. All generic fields must be extended from this base.
 *  @Created:        08 Apr 2019
 *  @CreatedBy :     
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { DemoBasePresComponent } from "./Demo.base.pres.component";
import { IDemoGenericFormField } from "../interfaces/Demo.generic.form.field.interface";
import { DemoGenericFormOpenTypeEnum } from "../enum/Demo.generic.form.open.type.enum";
import { DemoObjectCardGenericModel } from "../models/Demo.object.card.generic.model";
import { DemoGenericFormFieldTypeEnum } from "../enum/Demo.generic.form.field.type.enum";
import { DemoGenericFormFieldLabelPositionEnum } from "../enum/Demo.generic.form.field.label.position.enum";
import { IDemoJSON } from "../interfaces/Demo.json.interface";
import { Error } from "tslint/lib/error";
import { DemoObjectDataModel } from "../models/Demo.object.data.model";
import { DemoObjectCardChangeFieldModel } from "../models/Demo.object.card.change.fields.model";
import { DemoObjectCardChangeRequestModel } from "../models/Demo.object.card.change.request.list.model";

/**
 * Component declaration of DemoBaseGenericComponent.
 */
@Component({
  selector: "Demo-base-generic-component",
  template: "",
})

/**
 * The base generic component of Demo. All generic components will be extending from this base. 
 */
export class DemoBaseGenericComponent extends DemoBasePresComponent implements IDemoGenericFormField {
  
  /**
   * The constructor of  component of DemoBaseGenericComponent.   
   */
  @Input() public fieldId: number;
  @Input() public fieldType: DemoGenericFormFieldTypeEnum;
  @Input() public label: string;
  @Input() public labelPosition: DemoGenericFormFieldLabelPositionEnum;
  @Input() public row: number;
  @Input() public column: number;
  @Input() public mandatoryMessage: string;
  @Input() public minLength: number;
  @Input() public format: string;
  @Input() public regex: string;
  @Input() public mandatory: boolean;
  
  /** caption of field */
  @Input() public caption: string;
  
  /** field category */
  @Input() public categoryid: number;
  
  /** field column order */
  @Input() public colorder: number;
  
  /** field total columns in row */
  @Input() public column_total: number;
  
  /** component name */
  @Input() public component: string;
  
  /** component type */
  @Input() public componenttype: DemoGenericFormFieldTypeEnum;
  
  /** data binding name */
  @Input() public data_binding_name: string;
  
  /** data service */
  @Input() public dataservice: string;
  
  /** description of data service */
  @Input() public dataservice_desc: string;
  
  /** name of entity */
  @Input() public entity_name: string;
  
  /** caption of group */
  @Input() public groupcaption: string;
  
  /** is it required field */
  @Input() public is_mandatory: number;
  
  /** it is readonly field for edit */
  @Input() public is_readonly_in_edit: number;
  
  /** is it read only for new */
  @Input() public is_readonly_in_new: number;
  
  /** is it unique field */
  @Input() public is_unique: number;
  
  /** is it visible on edit */
  @Input() public is_visible_in_edit: number;
  
  /** is it visible for new  */
  @Input() public is_visible_in_new: number;
  
  /** position of caption */
  @Input() public label_position: number;
  
  /** logs */
  @Input() public log_changes: number;
  
  /** message to show */
  @Input() public mandatory_message: string;
  
  /** minimum length */
  @Input() public min_length: number;
  
  /** database field from WS */
  @Input() public object_card_object_id: number;
  
  /** database field from WS */
  @Input() public object_entity_id: number;
  
  /** database field from WS */
  @Input() public on_enter: string;
  
  /** database field from WS */
  @Input() public on_leave: string;
  
  /** database field from WS */
  @Input() public on_select: string;
  
  /** database field from WS */
  @Input() public params: string;
  
  /** database field from WS */
  @Input() public roworder: number;
  
  /** database field from WS */
  @Input() public show_match_list: number;
  
  /** database field from WS  */
  @Input() public unique_scope: number;
  
  /** database field from WS  */
  @Input() public field_type_name: string;
  
  /** database field from WS */
  @Input() public querytype: number;
  
  /** database field from WS  */
  @Input() public record_binding_name!: string;
  
  /** database field from WS  */
  @Input() public fieldValue: string;
  
  /** textbox in html */
  @ViewChild("textbox") public input!: ElementRef;
  
  /** recordId */
  @Input() public recordid: number;
  
  /** record */
  protected record: IDemoJSON;
  
  /** store binding name */
  @Input() public store_binding_name: string;
  
  /** oc_category_id */
  @Input() public oc_category_id: number;
  
  /** oc_category_id */
  @Input() public oc_field_id: number;

  /** is_change_request_mandatory */
  @Input() public is_change_request_mandatory: number;
  
  /** this will be used to rollback to previous value */
  protected previousValue!: object;
  
  /** this determines the open reason of this field */
  public openType: DemoGenericFormOpenTypeEnum = DemoGenericFormOpenTypeEnum.NEW;

  /** openUpdateType */
  @Input() public openUpdateType: boolean;

  /**
   * fieldsQueryList
   */
  public fieldsQueryList: DemoObjectCardChangeFieldModel[] = [];

  /** showComplexUpdate */
  public showComplexUpdate: boolean = false;

  /** unapprovedRequest */
  @Input() public unapprovedRequest: DemoObjectCardChangeRequestModel;

  /**
   * isLastComponent
   */
  @Input() public isLastComponent: boolean = false;
  
  constructor() {
    super();
    this.fieldId = 0;
    this.fieldType = DemoGenericFormFieldTypeEnum.TEXT_BOX;
    this.label = "";
    this.labelPosition = DemoGenericFormFieldLabelPositionEnum.Left;
    this.row = 0;
    this.column = 0;
    this.mandatoryMessage = "";
    this.minLength = 0;
    this.format = "";
    this.regex = "";
    this.mandatory = false;
    this.caption = "";
    this.categoryid = 0;
    this.colorder = 0;
    this.column = 0;
    this.column_total = 0;
    this.component = "";
    this.componenttype = DemoGenericFormFieldTypeEnum.TEXT_BOX;
    this.data_binding_name = "";
    this.dataservice = "";
    this.dataservice_desc = "";
    this.entity_name = "";
    this.groupcaption = "";
    this.is_mandatory = 0;
    this.is_readonly_in_edit = 0;
    this.is_readonly_in_new = 0;
    this.is_unique = 0;
    this.is_visible_in_edit = 0;
    this.is_visible_in_new = 0;
    this.label_position = 0;
    this.log_changes = 0;
    this.mandatory_message = "";
    this.min_length = 0;
    this.object_card_object_id = 0;
    this.object_entity_id = 0;
    this.on_enter = "";
    this.on_leave = "";
    this.on_select = "";
    this.params = "";
    this.row = 0;
    this.roworder = 0;
    this.show_match_list = 0;
    this.unique_scope = 0;
    this.field_type_name = "";
    this.querytype = 0;
    this.recordid = 0;
    this.oc_category_id = 0;
    this.fieldValue = "";
    this.store_binding_name = "";
    this.record = {};
    this.oc_field_id = 0;
    this.is_change_request_mandatory = 0;
    this.dataModel = new DemoObjectDataModel();
    this.openUpdateType = false;
    this.unapprovedRequest = new DemoObjectCardChangeRequestModel();
  }
  
  /**
   * It returns read only state of field
   * @returns {boolean}
   */
  public isReadOnly(): boolean {
    return (this.is_readonly_in_edit === 1);
  }
  
  public getGenericModel(): DemoObjectCardGenericModel {
    return new DemoObjectCardGenericModel();
  }
  
  /** is this required field */
  public isMandatory(): boolean {
    this.mandatory = (this.is_mandatory === 1);
    return this.mandatory;
  }
  
  /** get field value */
  public getValue(): { [key: string]: string } {
    throw new Error("This function must be implemented in Generic class like textbox, richtext etc.. where it extends.(DemoBaseGenericComponent)");
  }
  
  /** set field value */
  @Input()
  public setValue(value: object): void {
    /** throw new Error(String.Format("This function must be implemented in Generic class {0}", value)); */
    if (value != null) {
      /** value config */
    }
  }
  
  /**
   * It returns the record's value regarding to the specific key
   * @param {string} key
   * @returns {any}
   */
  
  /* tslint:disable-next-line: no-any */
  public getRecordValue(key: string): any {
    if (!key) {
      throw new Error("Key cannot be null.");
    }
    
    /* tslint:disable-next-line: no-any */
    let value: any = null;
    
    if (key in this.record) {
      value = this.record[key];
    }
    return value;
  }
  
  /**
   * this event emitter is used to notify subscribers
   * @type {EventEmitter<any>}
   */
  @Output() public valueChangedEvent: EventEmitter<IDemoGenericFormField> = new EventEmitter();

  /**
   * this event emitter is used to notify subscribers
   * * @type {EventEmitter<IDemoGenericFormField>}
   */
  @Output() public fieldClickedEvent: EventEmitter<IDemoGenericFormField> = new EventEmitter(); 
  
  /**
   * this function will be called from component when the value changed
   */
  public onFieldValueChanged(): void {
    this.valueChangedEvent.emit(this);
  }
  
  /**
   * it returns true if the value of field is null or empty
   * @returns {boolean}
   */
  public isValueNullOrEmpty(): boolean {
    /** throw new Error("This function must be implemented in Generic class like textbox, richtext etc.. where it extends.(DemoBaseGenericComponent)"); */
    return true;
  }
  
  /**
   * if the value needs to be rolled back to previous value, this function will be called.
   */
  public rollbackPreviousValue(): void {
    /** throw new Error("This function must be implemented in Generic class like textbox, richtext etc.. where it extends.(DemoBaseGenericComponent)"); */
  }
  
  /**
   * It is called when there is an update on record
   * @param {string[]} keys
   * @param {IDemoJSON} record
   */
  public onRecordUpdated(keys: string[], record: IDemoJSON): void {
    if (!keys && !record) {
      /** TODO: implement */
    }
    
    this.setRecord(record);
  }
  
  /**
   * It is called when the component initialized
   */
  public onInitialized(): void {
    /** todo: */
  }
  
  /**
   * It is called when the component initialized
   */
  public setRecord(record: IDemoJSON): void {
    this.record = record;
    if (this.record === undefined) {
      this.record = {};
    }
  }
  
  /**
   * dataModel
   */
  public dataModel: DemoObjectDataModel;
  
  /**
   * It sets the data model
   */
  public setObjectDataModel(data: DemoObjectDataModel): void {
    this.dataModel = data;
  }
  
  /**
   * getObjectDataModel
   * @returns {DemoObjectDataModel}
   */
  public getObjectDataModel(): DemoObjectDataModel {
    return this.dataModel;
  }

  /**
   * this function will be called from component when the clicked on field
   */
  public onClicked(): void {
    this.fieldClickedEvent.emit(this);
  }

  /**
   * This function will be called from component to show duplicate componenent
   */
  public showDuplicateComponent(fieldsQueryList: DemoObjectCardChangeFieldModel[]): void {
    if (fieldsQueryList.length === 0) {
      /**  */
    }
  }

  /** This function will be used for to check change mode enable or not */
  public isChangeModeEnabled(): boolean {
    if (this.is_change_request_mandatory === 1) {
      if (this.is_readonly_in_edit === 0 && this.openType === DemoGenericFormOpenTypeEnum.CHANGE) {
        return true;
      } 
      return false;
    }
    return false;
  }

}
