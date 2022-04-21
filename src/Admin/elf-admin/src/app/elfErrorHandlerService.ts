import { Injectable } from '@angular/core';
import { IAppInsights } from '@microsoft/applicationinsights-common';
import { arrForEach, isFunction } from '@microsoft/applicationinsights-core-js';
import { environment } from 'src/environments/environment';
import { IElfErrorService } from './IElfErrorService';

@Injectable({
    providedIn: 'root'
})
export class ElfApplicationinsightsErrorHandlerService implements IElfErrorService {
    public static instance: ElfApplicationinsightsErrorHandlerService;
    private analyticsPlugin: IAppInsights;
    private errorServices: IElfErrorService[] = [];

    constructor() {
        if (ElfApplicationinsightsErrorHandlerService.instance === null) {
            ElfApplicationinsightsErrorHandlerService.instance = this;
        }
    }

    public set plugin(analyticsPlugin: IAppInsights) {
        this.analyticsPlugin = analyticsPlugin;
    }

    public addErrorHandler(errorService: IElfErrorService): void {
        if (errorService && isFunction(errorService.handleError)) {
            this.errorServices.push(errorService);
        }
    }

    public removeErrorHandler(errorService: IElfErrorService): void {
        if (errorService && isFunction(errorService.handleError)) {
            const idx = this.errorServices.indexOf(errorService);
            if (idx !== -1) {
                this.errorServices.splice(idx, 1);
            }
        }
    }

    handleError(error: any): void {
        console.log(error);

        if (environment.production) { 
            if (this.analyticsPlugin) {
                this.analyticsPlugin.trackException({ exception: error });
            }
    
            if (this.errorServices && this.errorServices.length > 0) {
                arrForEach(this.errorServices, errorService => {
                    if (isFunction(errorService.handleError)) {
                        errorService.handleError(error);
                    }
                });
            }
        }
    }
}