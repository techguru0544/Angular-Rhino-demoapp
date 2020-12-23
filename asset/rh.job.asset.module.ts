/*
 *  @Project:        Demo
 *  @File:           Demo.job.asset.module.ts
 *  @Description:    The job asset module of Demo.
 *  @Created:        08 Aug 2019
 *  @CreatedBy:      
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DemoJobAssetGridPageComponent } from "./Demo.job.asset.grid.page.component";
import { DemoJobAssetGridComponent } from "app/main/components/job/asset/Demo.job.asset.grid.component";
import { DemoJobAssetGridColumnSettingsComponent } from "app/main/components/job/asset/Demo.job.asset.grid.column.settings.component";
import { DemoJobAssetGridSettingsComponent } from "app/main/components/job/asset/Demo.job.asset.grid.settings.component";
import { DemoSharedModule } from "app/modules/Demo.shared.module";
import { DemoGridColumnDialogModule } from "app/main/shared/gridcolumndialog/Demo.gridcolumndialog.module";
import { ContextMenuModule } from "ngx-contextmenu";

/**
 * The job asset module of Demo.
 */
@NgModule({
  declarations: [
    DemoJobAssetGridPageComponent,
    DemoJobAssetGridComponent,
    DemoJobAssetGridColumnSettingsComponent,
    DemoJobAssetGridSettingsComponent,
  ],
  entryComponents: [],
  exports: [
    DemoJobAssetGridPageComponent,
    DemoJobAssetGridComponent,
  ],
  imports: [
    CommonModule,
    DemoSharedModule,
    DemoGridColumnDialogModule,
    ContextMenuModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

/**
 * Demo job asset Module
 */
export class DemoJobAssetModule {
}
