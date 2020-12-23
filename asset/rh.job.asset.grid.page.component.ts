/*
 *  @Project:        Demo
 *  @File:           Demo.job.asset.grid.page.component.ts
 *  @Description:    The job asset grid page component of Demo.
 *  @Created:        08 Aug 2019
 *  @CreatedBy :     
 */
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { takeUntil, tap } from "rxjs/operators";
import { DemoPage } from "app/core/models/Demo.page.model";
import { DemoStorageItemEnum } from "app/core/enum/Demo.storage.item.enum";
import { IDemoJSON } from "app/core/interfaces/Demo.json.interface";
import { DemoBaseGridPageComponent } from "app/core/base/Demo.base.grid.page.component";
import { DemoJobAssetGridComponent } from "app/main/components/job/asset/Demo.job.asset.grid.component";
import { IDemoStorage } from "app/core/interfaces/Demo.storage.interface";
import { DemoStaticHelperClass } from "app/core/helpers/Demo.static.helper.class";

/**
 * The job asset grid page of Demo.
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  providers: [DemoJobAssetGridComponent],
  selector: "Demo-job-asset-grid-page",
  templateUrl: "./Demo.job.asset.grid.page.component.html",
  styleUrls: ["./Demo.job.asset.grid.page.component.scss"],
})
export class DemoJobAssetGridPageComponent extends DemoBaseGridPageComponent implements OnInit, OnDestroy {

  /**
   * JobId of Demo job asset page component
   */
  public jobId: number;

  /**
   * page use for handle grid pagination
   */
  public assetPage: DemoPage = new DemoPage();
  
  /**
   * rows use for store grid rows
   */
  public assetRows: object[] = [];

  /**
   * cache use for handle grid rows
   */
  public assetCache: IDemoJSON = {};

  /** 
   * loadingIndicator use for grid loading bar
   */
  public assetLoadingIndicator: boolean;

  /**
   * use for inherit job asset page functions
   */
  private jobassetgrid: DemoJobAssetGridComponent;

  /**
   * Unsubscribe all of Demo job asset page component
   */
  private _unsubscribeAll: Subject<() => {}>;
  
  /** recordId to be used */
  @Input() public recordid!: number;

  /**
   * intialize grid component on load
   */
  @ViewChild("jobassetgrid", { static: true }) set jobAssetGrid(grid: DemoJobAssetGridComponent) {
    this.jobassetgrid = grid;
  }

  /**
   * The job asset functinos of Demo.
   * @param route: ActivatedRoute 
   */
  constructor(
    private route: ActivatedRoute,
  ) {
    super();
    this.waitingResponse = false;
    this.assetLoadingIndicator = false;
    this.jobassetgrid = this.jobAssetGrid;
    this.jobId = 0;
    this._unsubscribeAll = new Subject();
  }

  /**
   * This function is called when the component loaded.
   */
  public ngOnInit(): void {
    if (this.recordid !== undefined && this.recordid > 0) {
      this.jobId = this.recordid;
    }
    this.route.params.pipe(
      takeUntil(this._unsubscribeAll),
      tap((params) => {    
        if (params.jobId) {
          this.jobId = params.jobId;         
        }
      },
      )).subscribe();
  }

  /**
   * On Destroy
   */
  public ngOnDestroy(): void {
    this._unsubscribeAll.unsubscribe();
    super.ngOnDestroy();
  }

  /**
   * This function get grid data.
   * @return {Promise<DemoPagedData<DemoJobcontactModel>>}
   */
  public getJobAssetList(pageInfo: DemoPage): void {
    this.assetPage.pageNumber = pageInfo.offset;
    this.assetPage.queryType = 680;
    this.assetPage.queryCountType = 685;
    this.assetPage.jobId = this.jobId;   
    if (pageInfo.pageSize !== 0) {
      this.setLocalStorageItem(DemoStorageItemEnum.JOB_ASSET_PAGESIZE, (pageInfo.pageSize).toString());
    }
    this.assetPage.size = Number(this.getLocalStorageItem(DemoStorageItemEnum.JOB_ASSET_PAGESIZE));
    
    if (this.assetCache[this.assetPage.pageNumber]) {
      return;
    }
    
    this.assetLoadingIndicator = true;
    this.waitingResponse = true;
    const startTime: number = Date.now();
    this.DemoService.getJobAssetsList(this.assetPage).then((pagedData) => {
      setTimeout(() => {
        this.assetLoadingIndicator = false;
      });
      this.assetPage.gridLoadTime = DemoStaticHelperClass.getTimeInMinutes((Date.now() - startTime));
      
      let i: number;
      for (i = 0; i < this.assetPage.totalElements; i = i + 1) {
        
        if (this.assetRows[i] == null) {
          this.assetRows[i] = [];
        }
      }
      
      this.assetPage = pagedData.page;
      this.gridvalue = pagedData.values;     
      const start: number = pagedData.page.start;
      const rows: object[] = [...this.assetRows];
      let currentRow: number;
      for (i = 0; i < pagedData.data.length; i = i + 1) {
        currentRow = start + i;
        rows[currentRow] = pagedData.data[i];
      }
      
      this.assetRows = rows;
      this.assetCache[pagedData.page.currentPage] = true;
      this.waitingResponse = false;
      setTimeout(() => {
        if (this.jobassetgrid.scrollY === 0) {
          this.jobassetgrid.resetGrid(this.jobassetgrid.gridid);
        }
      });
    })
    .catch((reason) => {
      throw reason;
    });
  
  }

  /**
   * Called whenever the user changes the sort order
   */
  public assetSortCallback(sorInfo: { dir: string, prop: string }): void {
    this.assetPage.order = sorInfo.dir;
    this.assetPage.field = sorInfo.prop;
    this.assetPage.offset = 0;
    this.assetCache = {};
    this.assetRows = [];
    this.jobassetgrid.scrollY = 0;
    this.jobassetgrid.resetGrid(this.jobassetgrid.gridid);
    this.assetPage.size = Number(this.getLocalStorageItem(DemoStorageItemEnum.JOB_ASSET_PAGESIZE));
    this.getJobAssetList(this.assetPage);
  }

  /**
   * Export to excel
   */
  public exportToExcelData(): void {
    this.excelLoadingIndicator = true;    
    const columnData: string | null = this.getLocalStorageItem(DemoStorageItemEnum.JOB_ASSET_GRID_COLUMNS);
    let query: string = this.gridvalue.query;

    if (columnData !== null){
      const getObject: IDemoStorage = JSON.parse(columnData);
      /* tslint:disable-next-line: no-any */
      const columns: any = getObject.result;

      const queryFrom: string = query.split("FROM")[1];
      const queryBeforeFrom: string[] = [];
      for (const key in columns){
        if (key && columns[key]){
          /* tslint:disable-next-line: no-any */
          const value: any = columns[key];
          queryBeforeFrom.push(`${value.excel} AS '${value.displayName}'`);
        }
      }
      query = `SELECT ${queryBeforeFrom.join()} FROM ${queryFrom}`;
    }
    this.gridvalue.query = query;    
    this.exportToExcel(this.gridvalue);
  }

}
