import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { protectedResources } from '../auth-config';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    url = protectedResources.reportApi.endpoint;

    constructor(private http: HttpClient) { }

    recentRequests(top: number) {
        return this.http.get<RequestTrack[]>(this.url + `/requests/recent/${top}`);
    }

    mostRequestedLinks(days: number) {
        return this.http.get<MostRequestedLinkCount[]>(this.url + `/requests/link/${days}`);
    }

    clientType(days: number) {
        return this.http.get<ClientTypeCount[]>(this.url + `/requests/clienttype/${days}`);
    }

    trackingCount(days: number) {
        return this.http.get<LinkTrackingDateCount[]>(this.url + `/tracking/${days}`);
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
    ipCountry: string;
    ipRegion: string;
    ipCity: string;
    ipasn: string;
    ipOrg: string;
}