import { Injectable } from '@angular/core';
import { Tag, TagService } from '../tag/tag.service';

@Injectable({
  providedIn: 'root'
})
export class AppCacheService {
  // TODO: research if this can be refactored into something like C# Dictionary
  public tags: Tag[] = [];

  constructor(private tagService: TagService) { }

  fetchCache() {
    this.tagService.list()
      .subscribe((result: Tag[]) => {
        this.tags = result;
      });
  }
}
