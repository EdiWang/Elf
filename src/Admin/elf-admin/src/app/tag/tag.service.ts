import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { protectedResources } from '../auth-config';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  url = protectedResources.tagApi.endpoint;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Tag[]>(this.url + '/list');
  }

  add(request: EditLinkRequest) {
    return this.http.post(this.url, request);
  }

  update(id: number, request: EditLinkRequest) {
    return this.http.put(this.url + `/${id}`, request);
  }
}

export interface EditLinkRequest {
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}