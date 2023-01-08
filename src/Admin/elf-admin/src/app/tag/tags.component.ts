import { Component, OnInit } from '@angular/core';
import { AppCacheService } from '../shared/appcache.service';
import { Tag, TagService } from './tag.service';
@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  isLoading: boolean = false;
  tagId: number;
  tags: Tag[];
  isNewTag: boolean = false;
  public tagDataItem: any;

  constructor(
    private appCache: AppCacheService,
    private service: TagService) { }

  ngOnInit(): void {
    this.getTags();
  }

  getTags() {
    this.isLoading = true;

    this.service.list()
      .subscribe((result: Tag[]) => {
        this.isLoading = false;
        this.tags = result;
        this.appCache.tags = result;
      });
  }

  //#region Delete

  public deleteTagDialogOpened: boolean = false;

  deleteTagDialogClose() {
    this.tagId = null;
    this.deleteTagDialogOpened = false;
  }

  deleteTag() {
    this.service.delete(this.tagId).subscribe(() => {
      this.deleteTagDialogOpened = false;
      this.getTags();
      this.tagId = null;
    });
  }

  remove(tag: Tag): void {
    this.tagId = tag?.id;
    this.deleteTagDialogOpened = true;
  }

  //#endregion

  //#region Add or Update

  onCancelTagUpdate() {
    this.tagDataItem = undefined;
  }

  onTagUpdate(val: Tag) {
    if (this.isNewTag) {
      this.service.add({ name: val.name }).subscribe(() => {
        this.tagDataItem = undefined;
        this.getTags();
      });
    }
    else {
      this.service.update(val.id, { name: val.name }).subscribe(() => {
        this.tagDataItem = undefined;
        this.getTags();
      });
    }
  }

  addNewTag() {
    this.isNewTag = true;
    this.tagDataItem = {};
  }

  update(tag: Tag): void {
    this.isNewTag = false;
    this.tagDataItem = tag;
  }

  //#endregion
}
