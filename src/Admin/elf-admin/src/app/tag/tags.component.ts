import { Component, OnInit } from '@angular/core';
import { AppCacheService } from '../shared/appcache.service';
import { ConfirmationDialog } from '../shared/confirmation-dialog';
import { EditTagDialog } from './edit-tag/edit-tag-dialog';
import { Tag, TagService } from './tag.service';
import {
  DialogService,
  DialogRef,
  DialogCloseResult,
} from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  isLoading: boolean = false;
  public deleteTagDialogOpened: boolean = false;
  tagId: number;
  tags: Tag[];

  constructor(
    private appCache: AppCacheService,
    private service: TagService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.getTags();
  }

  addNewTag() {
    // let diagRef = this.dialog.open(EditTagDialog);
    // diagRef.afterClosed().subscribe(result => {
    //   this.getTags();
    // });
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

  update(tag: Tag): void {
    // let diagRef = this.dialog.open(EditTagDialog, { data: tag });
    // diagRef.afterClosed().subscribe(result => {
    //   if (result) this.getTags();
    // });
  }
}
