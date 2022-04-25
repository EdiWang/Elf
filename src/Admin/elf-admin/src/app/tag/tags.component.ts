import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EditTagDialog } from './edit-tag-dialog';
import { TagService } from './tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  isLoading = false;

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
  }
}
