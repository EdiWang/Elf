import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Link, LinkService, PagedLinkResult } from './link.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditLinkDialog } from './edit-link/edit-link-dialog';
import { ShareDialog } from './share/share-dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ConfirmationDialog } from '../shared/confirmation-dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { AppCacheService } from '../shared/appcache.service';
import { Tag } from '../tag/tag.service';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
@Component({
    selector: 'app-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    tagCtrl = new FormControl();
    filteredTags: Observable<Tag[]>;

    ENV = environment;
    isLoading = false;
    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
    searchTerm: string;
    pageSizeOptions: number[] = [10, 15, 20, 50, 100];
    queryTags: Tag[] = [];
    allTags: Tag[] = [];

    displayedColumns: string[] = ['fwToken', 'originUrl', 'note', 'akaName', 'tags', 'isEnabled', 'ttl', 'updateTimeUtc', 'action', 'manage'];
    dataSource: MatTableDataSource<Link> = new MatTableDataSource();
    @ViewChild('tagInput') tagInput: ElementRef;

    constructor(
        private toastr: ToastrService,
        public dialog: MatDialog,
        private clipboard: Clipboard,
        private appCache: AppCacheService,
        private linkService: LinkService) {
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: Tag | null) => tag ? this._filter(tag) : this.allTags.slice()));
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit(): void {
        this.getAllTags();
        this.getLinks();
    }

    getAllTags() {
        this.allTags = this.appCache.tags;
    }

    addNewLink() {
        let diagRef = this.dialog.open(EditLinkDialog);
        diagRef.afterClosed().subscribe(result => {
            if (result) {
                this.getLinks();
                this.appCache.fetchCache();
            }
        });
    }

    shareLink(link: Link) {
        this.dialog.open(ShareDialog, { data: link });
    }

    editLink(link: Link) {
        let diagRef = this.dialog.open(EditLinkDialog, { data: link });
        diagRef.afterClosed().subscribe(result => {
            if (result) {
                this.getLinks();
                this.appCache.fetchCache();
            }
        });
    }

    search() {
        this.getLinks(true);
    }

    getLinks(reset: boolean = false): void {
        if (reset) {
            this.totalRows = 0;
            this.currentPage = 0;
        }

        this.isLoading = true;

        this.linkService.list(this.pageSize, this.currentPage * this.pageSize, this.searchTerm)
            .subscribe((result: PagedLinkResult) => {
                this.isLoading = false;

                this.dataSource = new MatTableDataSource(result.links);

                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;

                setTimeout(() => {
                    this.paginator.pageIndex = this.currentPage;
                    this.paginator.length = result.totalRows;
                });
            });
    }

    checkLink(id: number, isEnabled: boolean): void {
        this.linkService.setEnable(id, isEnabled).subscribe(() => {
            this.toastr.success('Updated');
        });
    }

    deleteLink(id: number): void {
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            data: {
                message: 'Are you sure want to delete this item?',
                buttonText: {
                    ok: 'Yes',
                    cancel: 'No'
                }
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.linkService.delete(id).subscribe(() => {
                    this.toastr.success('Deleted');
                    this.getLinks();
                });
            }
        });
    }

    pageChanged(event: PageEvent) {
        console.log({ event });
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getLinks();
    }

    copyChip(link: Link) {
        this.clipboard.copy(environment.elfApiBaseUrl + '/fw/' + link.fwToken);
        this.toastr.info('Copied');
    }

    copyAka(link: Link) {
        this.clipboard.copy(environment.elfApiBaseUrl + '/aka/' + link.akaName);
        this.toastr.info('Aka url copied');
    }

    //#region Query by Tags

    searchByTags() {
        if (this.queryTags.length == 0) {
            this.getLinks();
            return;
        }

        this.isLoading = true;
        this.linkService.listByTags(this.pageSize, this.currentPage * this.pageSize, this.queryTags.map(t => t.id))
            .subscribe((result: PagedLinkResult) => {
                this.isLoading = false;

                this.dataSource = new MatTableDataSource(result.links);

                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;

                setTimeout(() => {
                    this.paginator.pageIndex = this.currentPage;
                    this.paginator.length = result.totalRows;
                });
            });
    }

    tagClick(tag: Tag) {
        if (!this.queryTags.includes(tag)) {
            this.queryTags.push(tag);
        }
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            var found = this.allTags.find(t => t.name.toLowerCase() == value);
            if (found && !this.queryTags.includes(found)) {
                this.queryTags.push(found);
            }
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.tagCtrl.setValue(null);
    }

    remove(tag: Tag, indx: number): void {
        this.queryTags.splice(indx, 1);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        if (!this.queryTags.includes(event.option.value)) {
            this.queryTags.push(event.option.value);
        }

        if (this.tagInput) this.tagInput.nativeElement.value = '';
        this.tagCtrl.setValue(null);
    }

    private _filter(value: Tag): Tag[] {
        return this.allTags.filter(tag => tag.name.toLowerCase().includes(value.name.toLowerCase()));
    }

    //#endregion
}