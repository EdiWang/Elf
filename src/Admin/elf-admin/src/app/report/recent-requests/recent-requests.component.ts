import { Component, OnInit } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { environment } from "src/environments/environment";
import { PagedRequestTrack, ReportService } from "../report.service";
import { SVGIcon, arrowRotateCwIcon, trashIcon } from '@progress/kendo-svg-icons';
@Component({
    selector: 'app-recent-requests',
    templateUrl: './recent-requests.component.html'
})
export class RecentRequestsComponent implements OnInit {
    public arrowRotateCwIcon: SVGIcon = arrowRotateCwIcon;
    public trashIcon: SVGIcon = trashIcon;
    
    ENV = environment;
    gridView: GridDataResult;
    pageSize = 5;
    skip = 0;
    isLoading: boolean = false;

    constructor(private service: ReportService) {
    }

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        this.isLoading = true;

        this.service.recentRequests(this.pageSize, this.skip).subscribe((result: PagedRequestTrack) => {
            this.isLoading = false;
            this.gridView = {
                data: result.requestTracks,
                total: result.totalRows
            };
        })
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.getData();
    }

    clearTrackingData() {
        this.service.clearTrackingData().subscribe(() => {
            this.getData();
        });
    }
}