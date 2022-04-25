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

  add(request: EditTagRequest) {
    return this.http.post(this.url, request);
  }

  update(id: number, request: EditTagRequest) {
    return this.http.put(this.url + `/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete(this.url + `/${id}`);
  }
}

export interface EditTagRequest {
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}