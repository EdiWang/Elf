import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Link, LinkService, PagedLinkResult } from './link.service';
import { MatDialog } from '@angular/material/dialog';
import { EditLinkDialog } from './edit-link/edit-link-dialog';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { AppCacheService } from '../shared/appcache.service';
import { Tag, TagService } from '../tag/tag.service';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
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
    linkId: number;

    ENV = environment;
    isLoading = false;
    pageSize = 10;
    skip = 0;
    searchTerm: string;
    queryTags: Tag[] = [];
    allTags: Tag[] = [];

    displayedColumns: string[] = ['manage'];
    public gridView: GridDataResult;
    @ViewChild('tagInput') tagInput: ElementRef;

    constructor(
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        private clipboard: Clipboard,
        private appCache: AppCacheService,
        private linkService: LinkService,
        private tagService: TagService) {
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | Tag | null) => tag ? this._filter(tag) : this.allTags.slice()));
    }

    ngOnInit(): void {
        this.updateTagCache();
        this.getLinks();
    }

    updateTagCache() {
        this.isLoading = true;
        this.tagService.list()
            .subscribe((result: Tag[]) => {
                this.isLoading = false;
                this.appCache.tags = result;
                this.allTags = result;
            });
    }

    addNewLink() {
        let diagRef = this.dialog.open(EditLinkDialog);
        diagRef.afterClosed().subscribe(result => {
            if (result) {
                this.getLinks();
                this.updateTagCache();
            }
        });
    }

    //#region Share

    currentShareLink: Link;
    shareLinkDialogOpened: boolean = false;
    qrUrl: string;
    shareLink(link: Link) {
        this.currentShareLink = link;
        this.qrUrl = environment.elfApiBaseUrl + '/fw/' + this.currentShareLink.fwToken;
        this.shareLinkDialogOpened = true;
    }

    shareLinkDialogClose() {
        this.currentShareLink = null;
        this.qrUrl = null;
        this.shareLinkDialogOpened = false;
    }

    //#endregion

    editLinkHandler({ dataItem }) {
        let diagRef = this.dialog.open(EditLinkDialog, { data: dataItem });
        diagRef.afterClosed().subscribe(result => {
            if (result) {
                this.getLinks();
                this.updateTagCache();
            }
        });
    }

    search() {
        this.getLinks(true);
    }

    getLinks(reset: boolean = false): void {
        if (reset) {
            this.skip = 0;
        }

        this.isLoading = true;

        this.linkService.list(this.pageSize, this.skip, this.searchTerm)
            .subscribe((result: PagedLinkResult) => {
                this.isLoading = false;
                this.gridView = {
                    data: result.links,
                    total: result.totalRows
                };
            });
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.getLinks();
    }

    checkLink(id: number, isEnabled: boolean): void {
        this.linkService.setEnable(id, isEnabled).subscribe(() => {
            this._snackBar.open('Updated', 'OK', {
                duration: 3000
            });
        });
    }

    //#region Delete

    public deleteLinkDialogOpened: boolean = false;

    deleteLinkDialogClose() {
        this.linkId = null;
        this.deleteLinkDialogOpened = false;
    }

    deleteLink(): void {
        this.linkService.delete(this.linkId).subscribe(() => {
            this.getLinks();
        });
    }

    removeLinkHandler({ dataItem }) {
        this.linkId = dataItem?.id;
        this.deleteLinkDialogOpened = true;
    }

    //#endregion

    copyUrl(link: Link) {
        this.clipboard.copy(environment.elfApiBaseUrl + '/fw/' + link.fwToken);
        this._snackBar.open('Copied', 'Done', {
            duration: 3000
        });
    }

    copyAka(link: Link) {
        this.clipboard.copy(environment.elfApiBaseUrl + '/aka/' + link.akaName);
        this._snackBar.open('Aka url copied', 'Done', {
            duration: 3000
        });
    }

    //#region Query by Tags

    searchByTags() {
        if (this.queryTags.length == 0) {
            this.getLinks();
            return;
        }

        this.isLoading = true;
        this.linkService.listByTags(this.pageSize, this.skip, this.queryTags.map(t => t.id))
            .subscribe((result: PagedLinkResult) => {
                this.isLoading = false;
                this.gridView = {
                    data: result.links,
                    total: result.totalRows
                };
            });
    }

    tagClick(tag: Tag) {
        if (!this.queryTags.includes(tag)) {
            this.queryTags.push(tag);
        }
    }

    add(event: MatChipInputEvent): void {
        const value = event.value;

        if ((value || '').trim()) {
            var found = this.allTags.find(t => t.name.toLowerCase() == value);
            if (found && !this.queryTags.includes(found)) {
                this.queryTags.push(found);
            }
        }

        // Reset the input value
        event.chipInput!.clear();

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

    private _filter(value: string | Tag): Tag[] {
        var t = typeof (value);
        if (t == 'string') {
            return this.allTags.filter(tag => tag.name.toLowerCase().includes((value as string).toLowerCase()));
        }
        else {
            return this.allTags.filter(tag => tag.name.toLowerCase().includes((value as Tag).name.toLowerCase()));
        }
    }

    //#endregion
}