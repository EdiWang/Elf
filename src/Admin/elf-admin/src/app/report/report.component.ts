import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LinkTrackingDateCount, ReportService } from './report.service';
import { environment } from 'src/environments/environment';
import { LegendLabelsContentArgs, SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { SVGIcon, arrowRotateCwIcon } from '@progress/kendo-svg-icons';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {
    public arrowRotateCwIcon: SVGIcon = arrowRotateCwIcon;

    ENV = environment;
    pipe = new DatePipe('en-US');
    public dateFormat: FormatSettings = {
        displayFormat: "MM/dd/yyyy",
        inputFormat: "MM/dd/yyyy"
    };
    public range = { start: null, end: new Date() };

    constructor(private service: ReportService) {
    }

    ngOnInit(): void {
        var date = new Date();
        date.setDate(date.getDate() - 7);
        this.range.start = date;
        this.getChartData();
    }

    getChartData() {
        this.getTrackingCount();
    }

    //#region trackingCountChart

    linkTrackingDateCount: LinkTrackingDateCount[];
    isTrackingCountLoading: boolean;
    getTrackingCount() {
        this.isTrackingCountLoading = true;

        this.service
            .trackingCount({
                startDateUtc: this.range.start,
                endDateUtc: this.range.end!.toISOString()
            })
            .subscribe((result: LinkTrackingDateCount[]) => {
                this.isTrackingCountLoading = false;

                result.map((p: LinkTrackingDateCount) => {
                    p.date = new Date(p.trackingDateUtc);
                    return p;
                });

                this.linkTrackingDateCount = result;
            })
    }

    //#endregion
}