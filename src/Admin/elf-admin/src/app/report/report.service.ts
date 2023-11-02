import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { protectedResources } from '../auth-config';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    url = protectedResources.reportApi.endpoint;

    constructor(private http: HttpClient) { }

    mostRequestedLinks(request: DateRangeRequest) {
        return this.http.post<MostRequestedLinkCount[]>(this.url + `/requests/link`, request);
    }

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
export interface MostRequestedLinkCount {
    fwToken: string;
    note: string;
    requestCount: number;
}
export interface RequestTrack {
    fwToken: string;
    note: string;
    userAgent: string;
    ipAddress: string;
    requestTimeUtc: string;
    ipCountry: string;
    ipRegion: string;
    ipCity: string;
    ipasn: string;
    ipOrg: string;
}

export interface PagedRequestTrack {
    requestTracks: RequestTrack[];
    totalRows: number;
    pageSize: number;
}