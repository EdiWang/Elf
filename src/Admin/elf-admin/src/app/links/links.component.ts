import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Link, LinkService, PagedLinkResult } from './link.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditLinkDialog } from './edit-link-dialog';
import { ShareDialog } from './share-dialog';
import { ClipboardService } from 'ngx-clipboard';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {
    ENV = environment;
    isLoading = false;
    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
    searchTerm: string;
    pageSizeOptions: number[] = [10, 15, 20, 50, 100];

    displayedColumns: string[] = ['fwToken', 'originUrl', 'note', 'akaName', 'isEnabled', 'ttl', 'updateTimeUtc', 'action', 'manage'];
    dataSource: MatTableDataSource<Link> = new MatTableDataSource();

    constructor(
        public dialog: MatDialog,
        private clipboardApi: ClipboardService,
        private service: LinkService) { }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit(): void {
        this.getLinks();
    }

    addNewLink() {
        let diagRef = this.dialog.open(EditLinkDialog);
        diagRef.afterClosed().subscribe(result => {
            if (result) this.getLinks();
        });
    }

    shareLink(link: Link) {
        this.dialog.open(ShareDialog, { data: link });
    }

    editLink(link: Link) {
        let diagRef = this.dialog.open(EditLinkDialog, { data: link });
        diagRef.afterClosed().subscribe(result => {
            if (result) this.getLinks();
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

        this.service.list(this.pageSize, this.currentPage * this.pageSize, this.searchTerm)
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
        this.service.setEnable(id, isEnabled).subscribe(() => {

        });
    }

    deleteLink(id: number): void {
        this.service.delete(id).subscribe(() => {
            this.getLinks();
        });
    }

    pageChanged(event: PageEvent) {
        console.log({ event });
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getLinks();
    }

    copyChip(link: Link) {
        this.clipboardApi.copyFromContent(environment.elfApiBaseUrl + '/fw/' + link.fwToken);
    }

    copyAka(link: Link) {
        this.clipboardApi.copyFromContent(environment.elfApiBaseUrl + '/aka/' + link.akaName);
    }
}