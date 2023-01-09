import { Component, OnInit } from '@angular/core';
import { Link, LinkService, PagedLinkResult } from './link.service';
import { environment } from 'src/environments/environment';
import { AppCacheService } from '../shared/appcache.service';
import { Tag, TagService } from '../tag/tag.service';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ClipboardService } from 'ngx-clipboard';
@Component({
    selector: 'app-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {
    linkId: number;
    isNewLink: boolean = false;
    public tagTreeItems: any[];
    public tagsComplexArrayValue: Tag[];

    ENV = environment;
    isLoading = false;
    pageSize = 15;
    skip = 0;
    searchTerm: string = null;
    allTags: Tag[] = [];

    public gridView: GridDataResult;

    constructor(
        private notificationService: NotificationService,
        private clipboardService: ClipboardService,
        private appCache: AppCacheService,
        private linkService: LinkService,
        private tagService: TagService) {
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

                this.tagTreeItems = [
                    {
                        name: 'Tags',
                        id: 0,
                        items: result,
                    },
                ];
            });
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

    public linkDataItem: any;

    addNewLink() {
        this.isNewLink = true;
        this.linkDataItem = {
            isEnabled: true,
            ttl: 3600
        };
    }

    onCancelLinkUpdate() {
        this.linkDataItem = undefined;
    }

    onLinkUpdate(val: Link) {
        console.info(val);

        if (this.isNewLink) {
            this.linkService
                .add({
                    originUrl: val.originUrl.trim(),
                    note: val.note,
                    akaName: val.akaName,
                    isEnabled: val.isEnabled,
                    ttl: val.ttl,
                    tags: val.tags.map(t => t.name)
                })
                .subscribe({
                    next: () => this.onLinkUpdateSuccess(),
                    error: (ex) => this.onLinkUpdateFail(ex)
                });
        }
        else {
            this.linkService
                .update(val.id, {
                    originUrl: val.originUrl.trim(),
                    note: val.note,
                    akaName: val.akaName,
                    isEnabled: val.isEnabled,
                    ttl: val.ttl,
                    tags: val.tags.map(t => t.name)
                })
                .subscribe({
                    next: () => this.onLinkUpdateSuccess(),
                    error: (ex) => this.onLinkUpdateFail(ex)
                });
        }
    }

    onLinkUpdateSuccess() {
        this.linkDataItem = undefined;

        this.notificationService.show({
            content: "Updated",
            cssClass: "button-notification",
            animation: { type: "slide", duration: 400 },
            position: { horizontal: "center", vertical: "bottom" },
            type: { style: "success", icon: true },
            hideAfter: 2000
        });

        this.getLinks();
        this.updateTagCache();
    }

    onLinkUpdateFail(ex) {
        this.notificationService.show({
            content: ex.statusText,
            cssClass: "button-notification",
            animation: { type: "slide", duration: 400 },
            position: { horizontal: "center", vertical: "bottom" },
            type: { style: "error", icon: true },
            hideAfter: 2000
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
            this.deleteLinkDialogOpened = false;
            this.getLinks();
        });
    }

    removeLinkHandler({ dataItem }) {
        this.linkId = dataItem?.id;
        this.deleteLinkDialogOpened = true;
    }

    //#endregion

    //#region Grid actions

    editLinkHandler({ dataItem }) {
        this.isNewLink = false;
        this.linkDataItem = dataItem;
    }

    checkLink(id: number, isEnabled: boolean): void {
        this.linkService.setEnable(id, isEnabled).subscribe(() => {
            this.notificationService.show({
                content: "Updated",
                cssClass: "button-notification",
                animation: { type: "slide", duration: 400 },
                position: { horizontal: "center", vertical: "bottom" },
                type: { style: "success", icon: true },
                hideAfter: 2000
            });
        });
    }

    copyUrl(link: Link) {
        this.clipboardService.copy(environment.elfApiBaseUrl + '/fw/' + link.fwToken);

        this.notificationService.show({
            content: "Url copied",
            cssClass: "button-notification",
            animation: { type: "slide", duration: 400 },
            position: { horizontal: "center", vertical: "bottom" },
            type: { style: "success", icon: true },
            hideAfter: 2000
        });
    }

    copyAka(link: Link) {
        this.clipboardService.copy(environment.elfApiBaseUrl + '/aka/' + link.akaName);

        this.notificationService.show({
            content: "Aka url copied",
            cssClass: "button-notification",
            animation: { type: "slide", duration: 400 },
            position: { horizontal: "center", vertical: "bottom" },
            type: { style: "success", icon: true },
            hideAfter: 2000
        });
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.getLinks();
    }

    //#endregion

    //#region Query by Tags

    searchByTags() {
        if (this.tagsComplexArrayValue.length == 0) {
            this.getLinks();
            return;
        }

        this.isLoading = true;
        this.linkService.listByTags(this.pageSize, this.skip, this.tagsComplexArrayValue.map(t => t.id))
            .subscribe((result: PagedLinkResult) => {
                this.isLoading = false;
                this.gridView = {
                    data: result.links,
                    total: result.totalRows
                };
            });
    }

    //#endregion
}