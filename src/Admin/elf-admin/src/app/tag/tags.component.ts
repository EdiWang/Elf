import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { AppCacheService } from '../shared/appcache.service';
import { Tag, TagService } from './tag.service';
import { SVGIcon, plusIcon, arrowRotateCwIcon } from '@progress/kendo-svg-icons';
@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  public plusIcon: SVGIcon = plusIcon;
  public arrowRotateCwIcon: SVGIcon = arrowRotateCwIcon;

  isLoading: boolean = false;
  tagId: number;
  tags: Tag[];
  isNewTag: boolean = false;
  public tagDataItem: any;

  constructor(
    private appCache: AppCacheService,
    private notificationService: NotificationService,
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
    this.service.delete(this.tagId).subscribe({
      next: () => {
        this.deleteTagDialogOpened = false;
        this.tagId = null;
        this.getTags();
      },
      error: (ex) => {
        this.onTagUpdateFail(ex);
      }
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
      this.service.add({ name: val.name }).subscribe({
        next: () => {
          this.onTagUpdateSuccess();
        },
        error: (ex) => {
          this.onTagUpdateFail(ex);
        }
      });
    }
    else {
      this.service.update(val.id, { name: val.name }).subscribe({
        next: () => {
          this.onTagUpdateSuccess();
        },
        error: (ex) => {
          this.onTagUpdateFail(ex);
        }
      });
    }
  }

  onTagUpdateSuccess() {
    this.tagDataItem = undefined;
    this.getTags();
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

  onTagUpdateFail(ex: HttpErrorResponse) {
    this.notificationService.show({
      content: `${ex.statusText}:${ex.message}`,
      cssClass: "button-notification",
      animation: { type: "slide", duration: 400 },
      position: { horizontal: "center", vertical: "bottom" },
      type: { style: "error", icon: true },
      hideAfter: 2000
    });
  }
}
