import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { protectedResources } from '../auth-config';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    url = protectedResources.reportApi.endpoint;

    constructor(private http: HttpClient) { }

    recentRequests(take: number, offset: number) {
        return this.http.get<RequestTrack[]>(this.url + `/requests?take=${take}&offset=${offset}`);
    }

    mostRequestedLinks(startDateUtcStr: string, endDateUtcStr: string) {
        return this.http.post<MostRequestedLinkCount[]>(this.url + `/requests/link`,
        {
            startDateUtc: startDateUtcStr,
            endDateUtc: endDateUtcStr
        });
    }

    clientType(startDateUtcStr: string, endDateUtcStr: string) {
        return this.http.post<ClientTypeCount[]>(this.url + `/requests/clienttype`,
        {
            startDateUtc: startDateUtcStr,
            endDateUtc: endDateUtcStr
        });
    }

    trackingCount(startDateUtcStr: string, endDateUtcStr: string) {
        return this.http.post<LinkTrackingDateCount[]>(this.url + `/tracking`,
            {
                startDateUtc: startDateUtcStr,
                endDateUtc: endDateUtcStr
            });
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