import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { protectedResources } from '../auth-config';

@Injectable({
    providedIn: 'root'
})
export class LinkService {
    url = protectedResources.linkApi.endpoint;

    constructor(private http: HttpClient) { }

    list(take: number, offset: number, term: string) {
        return this.http.get<PagedLinkResult>(this.url + `/list?take=${take}&offset=${offset}` + (term ? `&term=${term}` : ''))
    }

    add(request: EditLinkRequest) {
        return this.http.post(this.url + '/create', request);
    }

    update(id: number, request: EditLinkRequest) {
        return this.http.put(this.url + `/${id}`, request);
    }

    delete(id: number) {
        return this.http.delete(this.url + `/${id}`);
    }

    setEnable(id: number, isEnabled: boolean) {
        return this.http.put(this.url + `/${id}/enable?isEnabled=${isEnabled}`, {});
    }
}

export interface EditLinkRequest {
    originUrl: string;
    note: string;
    akaName: string;
    isEnabled: boolean;
    ttl: number;
}

export interface PagedLinkResult {
    links: Link[];
    totalRows: number;
}

export interface Link {
    akaName: string;
    fwToken: string;
    id: number;
    isEnabled: boolean;
    note: string;
    originUrl: string;
    tenantId: string;
    ttl: number;
    updateTimeUtc: Date;
}