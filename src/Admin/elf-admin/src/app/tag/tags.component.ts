import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EditTagDialog } from './edit-tag-dialog';
import { Tag, TagService } from './tag.service';
@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  isLoading: boolean = false;

  tags: Tag[];

  constructor(
    private toastr: ToastrService,
    public dialog: MatDialog,
    private service: TagService) { }

  ngOnInit(): void {
    this.getTags();
  }

  addNewTag() {
    let diagRef = this.dialog.open(EditTagDialog);
    diagRef.afterClosed().subscribe(result => {
      if (result) this.getTags();
    });
  }

  getTags() {
    this.isLoading = true;

    this.service.list()
      .subscribe((result: Tag[]) => {
        this.isLoading = false;
        this.tags = result;
      });
  }

  remove(tag: Tag): void {

  }

  update(tag: Tag): void {
    let diagRef = this.dialog.open(EditTagDialog, { data: tag });
    diagRef.afterClosed().subscribe(result => {
      if (result) this.getTags();
    });
  }
}
