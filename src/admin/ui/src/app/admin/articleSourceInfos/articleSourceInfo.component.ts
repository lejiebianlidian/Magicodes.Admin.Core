﻿import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { CommonLookupModalComponent } from '@app/shared/common/lookup/common-lookup-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EntityDtoOfInt64, FindUsersInput, NameValueDto, SwitchEntityInputDtoOfInt64,  } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { InputSwitchModule } from 'primeng/inputswitch';

import { ArticleSourceInfoServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditArticleSourceInfoModalComponent } from './create-or-edit-articleSourceInfo-modal.component';


@Component({
    templateUrl: './articleSourceInfo.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class ArticleSourceInfosComponent extends AppComponentBase implements OnInit {    
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;
	@ViewChild('createOrEditArticleSourceInfoModal') createOrEditArticleSourceInfoModal: CreateOrEditArticleSourceInfoModalComponent;


	advancedFiltersAreShown = false;
	model: {
        //是否仅获取回收站数据
        isOnlyGetRecycleData: boolean;
        filterText: string;
		creationDateRangeActive: boolean;        
        creationDateStart: moment.Moment;
        creationDateEnd: moment.Moment;
		subscriptionEndDateRangeActive: boolean;
        subscriptionEndDateStart: moment.Moment;
        subscriptionEndDateEnd: moment.Moment;
    } = <any>{};

	constructor(
        injector: Injector,        
        private _activatedRoute: ActivatedRoute,
		private _fileDownloadService: FileDownloadService,

		private _articleSourceInfoService: ArticleSourceInfoServiceProxy,
        
    ) {		
        super(injector);
        this.setFiltersFromRoute();
    }

	setFiltersFromRoute(): void {
		const self = this;
        if (self._activatedRoute.snapshot.queryParams['subscriptionEndDateStart'] != null) {
            self.model.subscriptionEndDateRangeActive = true;
            self.model.subscriptionEndDateStart = moment(this._activatedRoute.snapshot.queryParams['subscriptionEndDateStart']);
        } else {
            self.model.subscriptionEndDateStart = moment().startOf('day');
        }

        if (self._activatedRoute.snapshot.queryParams['subscriptionEndDateEnd'] != null) {
            self.model.subscriptionEndDateRangeActive = true;
            self.model.subscriptionEndDateEnd = moment(this._activatedRoute.snapshot.queryParams['subscriptionEndDateEnd']);
        } else {
            self.model.subscriptionEndDateEnd = moment().add(30, 'days').endOf('day');
        }
        if (self._activatedRoute.snapshot.queryParams['creationDateStart'] != null) {
            self.model.creationDateRangeActive = true;
            self.model.creationDateStart = moment(self._activatedRoute.snapshot.queryParams['creationDateStart']);
        } else {
            self.model.creationDateStart = moment().add(-7, 'days').startOf('day');
        }

        if (self._activatedRoute.snapshot.queryParams['creationDateEnd'] != null) {
            self.model.creationDateRangeActive = true;
            self.model.creationDateEnd = moment(self._activatedRoute.snapshot.queryParams['creationDateEnd']);
        } else {
            self.model.creationDateEnd = moment().endOf('day');
        }
    }

	ngOnInit(): void {
		const self = this;
        self.model.filterText = self._activatedRoute.snapshot.queryParams['filterText'] || '';
    }

	getArticleSourceInfos(event?: LazyLoadEvent) {
		const self = this;
        if (self.primengTableHelper.shouldResetPaging(event)) {
            self.paginator.changePage(0);
            return;
        }
        self.primengTableHelper.showLoadingIndicator();

        self._articleSourceInfoService.getArticleSourceInfos(
            self.model.isOnlyGetRecycleData ? self.model.isOnlyGetRecycleData : false,
			self.model.creationDateRangeActive ? self.model.creationDateStart : undefined,
			self.model.creationDateRangeActive ? self.model.creationDateEnd : undefined,
			self.model.subscriptionEndDateRangeActive ? self.model.subscriptionEndDateStart : undefined,
            self.model.subscriptionEndDateRangeActive ? self.model.subscriptionEndDateEnd : undefined,
			self.model.filterText,                  
            self.primengTableHelper.getSorting(self.dataTable),
            self.primengTableHelper.getMaxResultCount(self.paginator, event),
            self.primengTableHelper.getSkipCount(self.paginator, event)
        ).subscribe(result => {
            self.primengTableHelper.totalRecordsCount = result.totalCount;
            self.primengTableHelper.records = result.items;
            self.primengTableHelper.hideLoadingIndicator();
        });
    }

    //获取回收站数据
    getRecycleData(): void {
        this.model.isOnlyGetRecycleData = !this.model.isOnlyGetRecycleData;
        this.getArticleSourceInfos();
    }
    //恢复数据
    restore(id: number): void {
        const self = this;
        self.message.confirm(
            self.l('AreYouSure'),
            self.l('RestoreWarningMessage'),
            isConfirmed => {
                if (isConfirmed) {
                    self._articleSourceInfoService.restoreArticleSourceInfo(id).subscribe(() => {
                        self.reloadPage();
                        self.notify.success(self.l('SuccessfullyRestore'));
                    });
                }
            }
        );
    }
	createArticleSourceInfo(): void {
		const self = this;
        self.createOrEditArticleSourceInfoModal.show();
    }

	editArticleSourceInfo(id:number): void {
		const self = this;
        self.createOrEditArticleSourceInfoModal.show(id);
    }

	deleteArticleSourceInfo(id: number): void {
		const self = this;
		self.message.confirm(
            self.l('AreYouSure'),
            self.l('DeleteWarningMessage'),
            isConfirmed => {
                if (isConfirmed) {
                    self._articleSourceInfoService.deleteArticleSourceInfo(id).subscribe(() => {
                        self.reloadPage();
                        self.notify.success(self.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

	reloadPage(): void {
		const self = this;
        self.paginator.changePage(self.paginator.getPage());
    }

	exportToExcel(): void {
        const self = this;
        self._articleSourceInfoService.getArticleSourceInfosToExcel(
            self.model.isOnlyGetRecycleData,
			self.model.subscriptionEndDateRangeActive ? self.model.subscriptionEndDateStart : undefined,
            self.model.subscriptionEndDateRangeActive ? self.model.subscriptionEndDateEnd : undefined,
			self.model.creationDateRangeActive ? self.model.creationDateStart : undefined,
			self.model.creationDateRangeActive ? self.model.creationDateEnd : undefined,
			self.model.filterText,
            undefined,
            1000,
            0).subscribe(result => {
                self._fileDownloadService.downloadTempFile(result);
            });
    }


}