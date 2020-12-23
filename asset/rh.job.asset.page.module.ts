/*
 *  @Project:        Demo
 *  @File:           Demo.job.asset.page.module.ts
 *  @Description:    The job asset page module of Demo.
 *  @Created:        08 Aug 2019
 *  @CreatedBy:      
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DemoAuthRouteGuard } from "../../../../core/guards/Demo.auth.route.guard";
import { RouterModule, Routes } from "@angular/router";
import { DemoJobAssetGridPageComponent } from "./Demo.job.asset.grid.page.component";
import { DemoJobAssetModule } from "./Demo.job.asset.module";

const routes: Routes = [
  {
    canActivate: [DemoAuthRouteGuard],
    children: [],
    component: DemoJobAssetGridPageComponent,
    path: "",
    resolve: {},
  },
];

/**
 * Job Asset Page Module of Demo
 */
@NgModule({
  declarations: [],
  exports: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    DemoJobAssetModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class DemoJobAssetPageModule {
}
