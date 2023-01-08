import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';

import { HomeComponent } from './home/home.component';
import { LinkService } from './links/link.service';
import { LinksComponent } from './links/links.component';
import { EditLinkDialog } from './links/edit-link/edit-link-dialog';
import { EditTagDialog } from './tag/edit-tag/edit-tag-dialog';
import { ReportComponent } from './report/report.component';
import { ConfirmationDialog } from './shared/confirmation-dialog';
import { TagsComponent } from './tag/tags.component';

import { ElfApplicationinsightsErrorHandlerService } from './error-handler.service';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

//#region BEGIN MSAL

import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalRedirectComponent } from '@azure/msal-angular';

import { msalConfig, loginRequest, protectedResources } from './auth-config';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { LabelModule } from '@progress/kendo-angular-label';
import { RecentRequestsComponent } from './report/recent-requests/recent-requests.component';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { BarcodesModule } from '@progress/kendo-angular-barcodes';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';




export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  protectedResourceMap.set(protectedResources.linkApi.endpoint, protectedResources.linkApi.scopes);
  protectedResourceMap.set(protectedResources.reportApi.endpoint, protectedResources.reportApi.scopes);
  protectedResourceMap.set(protectedResources.tagApi.endpoint, protectedResources.tagApi.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest
  };
}

//#endregion

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LinksComponent,
    ReportComponent,
    RecentRequestsComponent,
    EditLinkDialog,
    EditTagDialog,
    ConfirmationDialog,
    TagsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MsalModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDialogModule,
    MatChipsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    GridModule,
    ButtonsModule,
    ChartsModule,
    IndicatorsModule,
    DateInputsModule,
    DialogsModule,
    LabelModule,
    NotificationModule,
    BarcodesModule,
    DropDownsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    {
      provide: ErrorHandler,
      useClass: ElfApplicationinsightsErrorHandlerService
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    LinkService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
