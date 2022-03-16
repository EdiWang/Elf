import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { protectedResources } from '../auth-config';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    url = protectedResources.reportApi.endpoint;

    constructor(private http: HttpClient) { }

    recentRequests() {
        return this.http.get<RequestTrack[]>(this.url + '/requests/recent');
    }

    mostRequestedLinksPastMonth() {
        return this.http.get<MostRequestedLinkCount[]>(this.url + '/requests/mostpastmonth');
    }

    clientTypePastMonth() {
        return this.http.get<ClientTypeCount[]>(this.url + '/requests/clienttypepastmonth');
    }

    trackingCountPastWeek() {
        return this.http.get<LinkTrackingDateCount[]>(this.url + '/tracking/pastweek');
    }

    clearTrackingData() {
        return this.http.delete(this.url + '/tracking/clear');
    }
}

export interface LinkTrackingDateCount {
    requestCount: number;
    trackingDateUtc: string;
}

export interface ClientTypeCount {
    clientTypeName: string;
    count: number;
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
}