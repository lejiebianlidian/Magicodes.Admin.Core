import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AddMemberModalComponent } from 'app/admin/organization-units/add-member-modal.component';
import { FileUploadModule } from 'ng2-file-upload';
import {
    ModalModule,
    PopoverModule,
    TabsModule,
    TooltipModule,
    BsDropdownModule
} from 'ngx-bootstrap';
import {
    BsDatepickerModule,
    BsDatepickerConfig,
    BsDaterangepickerConfig,
    BsLocaleService
} from 'ngx-bootstrap/datepicker';
import {
    AutoCompleteModule,
    EditorModule,
    FileUploadModule as PrimeNgFileUploadModule,
    InputMaskModule,
    PaginatorModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { LightboxModule } from 'primeng/lightbox';
import { OverlayPanelModule } from 'primeng/overlayPanel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TreeTableModule } from 'primeng/treetable';
import { DropdownModule } from 'primeng/dropdown';
import { TreeModule } from 'primeng/tree';
import { DragDropModule } from 'primeng/dragdrop';
import { TreeDragDropService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { AuditLogComponent } from './components/auditLog/audit-log.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AuditLogDetailModalComponent } from './audit-logs/audit-log-detail-modal.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { EntityChangeDetailModalComponent } from './audit-logs/entity-change-detail-modal.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { DemoUiDateTimeComponent } from './demo-ui-components/demo-ui-date-time.component';
import { DemoUiEditorComponent } from './demo-ui-components/demo-ui-editor.component';
import { DemoUiFileUploadComponent } from './demo-ui-components/demo-ui-file-upload.component';
import { DemoUiInputMaskComponent } from './demo-ui-components/demo-ui-input-mask.component';
import { DemoUiSelectionComponent } from './demo-ui-components/demo-ui-selection.component';
import { CreateOrEditEditionModalComponent } from './editions/create-or-edit-edition-modal.component';
import { EditionsComponent } from './editions/editions.component';
import { InstallComponent } from './install/install.component';
import { CreateOrEditLanguageModalComponent } from './languages/create-or-edit-language-modal.component';
import { EditTextModalComponent } from './languages/edit-text-modal.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { CreateOrEditUnitModalComponent } from './organization-units/create-or-edit-unit-modal.component';
import { OrganizationTreeComponent } from './organization-units/organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-units/organization-unit-members.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { PaySettingsComponent } from './settings/paySettings/pay-settings.component';
import { CreateSplitFundInfoModalComponent } from './settings/paySettings/create-splitFundInfo-modal.component';
import { EditSplitFundInfoModalComponent } from './settings/paySettings/edit-splitFundInfo-modal.component';
import { SmsCodeSettingsComponent } from './settings/smsCode-settings.component';
import { EditionComboComponent } from './shared/edition-combo.component';
import { FeatureTreeComponent } from './shared/feature-tree.component';
import { OrganizationUnitsTreeComponent } from './shared/organization-unit-tree.component';
import { PermissionComboComponent } from './shared/permission-combo.component';
import { PermissionTreeComponent } from './shared/permission-tree.component';
import { RoleComboComponent } from './shared/role-combo.component';
import { EnumComboComponent } from './components/enum-combo/enum-combo.component';
import { DataComboComponent } from './components/data-combo/data-combo.component';
import { FileUploadComponent } from './components/fileUpload/file-upload.component';
import { FileUploadModalComponent } from './components/fileUploadModal/fileUploadModal.component';
import { ObjectImageListComponent } from './components/object-imageList/object-imageList.component';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenants/tenant-features-modal.component';
import { TenantsComponent } from './tenants/tenants.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './users/edit-user-permissions-modal.component';
import { ImpersonationService } from './users/impersonation.service';
import { UsersComponent } from './users/users.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountoModule } from 'angular2-counto';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { ArticleInfoArticleTagInfoComponent } from './articleInfos/articleTagInfo.component';
import { ArticleInfoArticleTagInfoCreateOrEditModalComponent } from './articleInfos/create-or-edit-articleTagInfo-modal.component';
import { ArticleInfosComponent } from './articleInfos/articleInfo.component';
import { CreateOrEditArticleInfoModalComponent } from './articleInfos/create-or-edit-articleInfo-modal.component';
import { ArticleSourceInfosComponent } from './articleSourceInfos/articleSourceInfo.component';
import { CreateOrEditArticleSourceInfoModalComponent } from './articleSourceInfos/create-or-edit-articleSourceInfo-modal.component';
import { ColumnInfosComponent } from './columnInfos/columnInfo.component';
import { CreateOrEditColumnInfoModalComponent } from './columnInfos/create-or-edit-columnInfo-modal.component';
import { StorageSettingsComponent } from './settings/storage-settings.component';
import { MiniProgramSettingsComponent } from './settings/miniProgram-settings.component';
import { TransactionLogsComponent } from './transactionLogs/transactionLog.component';
import { CreateOrEditTransactionLogModalComponent } from './transactionLogs/create-or-edit-transactionLog-modal.component';
import { ColumnInfoTreeSelectComponent } from './appComponents/columnInfoTreeSelect/columnInfo-tree-select.component';

NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AdminRoutingModule,
        UtilsModule,
        AppCommonModule,
        TableModule,
        LightboxModule,
        TreeModule,
        DragDropModule,
        ContextMenuModule,
        PaginatorModule,
        PrimeNgFileUploadModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        OverlayPanelModule,
        InputSwitchModule,
        TreeTableModule,
        DropdownModule,
        NgxChartsModule,
        CountoModule,
        TextMaskModule,
        ImageCropperModule
    ],
    declarations: [
        UsersComponent,
        PermissionComboComponent,
        RoleComboComponent,
        EnumComboComponent,
        DataComboComponent,
        FileUploadComponent,
        FileUploadModalComponent,
        ObjectImageListComponent,
        CreateOrEditUserModalComponent,
        EditUserPermissionsModalComponent,
        PermissionTreeComponent,
        FeatureTreeComponent,
        OrganizationUnitsTreeComponent,
        RolesComponent,
        CreateOrEditRoleModalComponent,
        AuditLogsComponent,
        AuditLogComponent,
        AuditLogDetailModalComponent,
        EntityChangeDetailModalComponent,
        HostSettingsComponent,
        PaySettingsComponent,
        CreateSplitFundInfoModalComponent,
        EditSplitFundInfoModalComponent,
        SmsCodeSettingsComponent,
        StorageSettingsComponent,
        MiniProgramSettingsComponent,
        InstallComponent,
        MaintenanceComponent,
        EditionsComponent,
        CreateOrEditEditionModalComponent,
        LanguagesComponent,
        LanguageTextsComponent,
        CreateOrEditLanguageModalComponent,
        TenantsComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        TenantFeaturesModalComponent,
        CreateOrEditLanguageModalComponent,
        EditTextModalComponent,
        OrganizationUnitsComponent,
        OrganizationTreeComponent,
        OrganizationUnitMembersComponent,
        CreateOrEditUnitModalComponent,
        TenantSettingsComponent,
        HostDashboardComponent,
        EditionComboComponent,
        InvoiceComponent,
        SubscriptionManagementComponent,
        AddMemberModalComponent,
        DemoUiComponentsComponent,
        DemoUiDateTimeComponent,
        DemoUiSelectionComponent,
        DemoUiFileUploadComponent,
        DemoUiInputMaskComponent,
        DemoUiEditorComponent,
        UiCustomizationComponent,
        TransactionLogsComponent,
        CreateOrEditTransactionLogModalComponent,
        ColumnInfoTreeSelectComponent,
        ArticleInfoArticleTagInfoComponent,
        ArticleInfoArticleTagInfoCreateOrEditModalComponent,
        ArticleInfosComponent,
        CreateOrEditArticleInfoModalComponent,
        ArticleSourceInfosComponent,
        CreateOrEditArticleSourceInfoModalComponent,
        ColumnInfosComponent,
        CreateOrEditColumnInfoModalComponent
    ],
    exports: [AddMemberModalComponent],
    providers: [
        ImpersonationService,
        TreeDragDropService,
        {
            provide: BsDatepickerConfig,
            useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig
        },
        {
            provide: BsDaterangepickerConfig,
            useFactory:
                NgxBootstrapDatePickerConfigService.getDaterangepickerConfig
        },
        {
            provide: BsLocaleService,
            useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale
        }
    ]
})
export class AdminModule {}
