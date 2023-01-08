import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { ReportService, RequestTrack } from "../report.service";

@Component({
    selector: 'app-recent-requests',
    templateUrl: './recent-requests.component.html'
})
export class RecentRequestsComponent implements OnInit { 
    ENV = environment;

    public gridView: any[];
    public requestTrack: RequestTrack[] = [];

    isRecentRequestsLoading = false;

    constructor(private service: ReportService) {
    }

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        this.isRecentRequestsLoading = true;

        this.service.recentRequests(100, 0).subscribe((result: RequestTrack[]) => {
            this.isRecentRequestsLoading = false;
            this.requestTrack = result;
            this.gridView = this.requestTrack;
        })
    }

    clearTrackingData() {
        this.service.clearTrackingData().subscribe(() => {
            this.getData();
        });
    }

}