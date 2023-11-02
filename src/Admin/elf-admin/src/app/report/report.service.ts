import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { protectedResources } from '../auth-config';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    url = protectedResources.reportApi.endpoint;

    constructor(private http: HttpClient) { }

    trackingCount(request: DateRangeRequest) {
        return this.http.post<LinkTrackingDateCount[]>(this.url + `/tracking`, request);
    }
}

export interface DateRangeRequest {
    startDateUtc: string;
    endDateUtc: string;
}

export interface LinkTrackingDateCount {
    requestCount: number;
    trackingDateUtc: string;
    date?: Date;
}