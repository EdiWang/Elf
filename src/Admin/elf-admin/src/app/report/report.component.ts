import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ClientTypeCount, LinkTrackingDateCount, MostRequestedLinkCount, ReportService, RequestTrack } from './report.service';
import { environment } from 'src/environments/environment';
import { LegendLabelsContentArgs, SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {
    ENV = environment;
    pipe = new DatePipe('en-US');
    public dateFormat: FormatSettings = {
        displayFormat: "MM/dd/yyyy",
        inputFormat: "MM/dd/yyyy",
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
        this.getClientType();
        this.getMostRequestedLinks();
    }

    //#region mostRequestedChart

    public labelContentMostRequestedLinkCount(args: LegendLabelsContentArgs): string {
        return `${args.dataItem.note} - ${args.dataItem.requestCount}`;
    }

    mostRequestedLinkCount: MostRequestedLinkCount[];
    isMostRequestedLinksLoading: boolean;
    getMostRequestedLinks() {
        this.isMostRequestedLinksLoading = true;
        this.service
            .mostRequestedLinks({
                startDateUtc: this.range.start,
                endDateUtc: this.range.end!.toISOString()
            })
            .subscribe((result: MostRequestedLinkCount[]) => {
                this.isMostRequestedLinksLoading = false;
                this.mostRequestedLinkCount = result;
            })
    }

    //#endregion

    //#region clientTypeChart

    public labelContentClientTypeCount(e: SeriesLabelsContentArgs): string {
        return `${e.category} - ${e.value}, ${(e.percentage * 100).toFixed(0)}%`;
    }

    clientTypeCount: ClientTypeCount[];
    isClientTypeLoading: boolean;
    getClientType() {
        this.isClientTypeLoading = true;
        this.service
            .clientType({
                startDateUtc: this.range.start,
                endDateUtc: this.range.end!.toISOString()
            })
            .subscribe((result: ClientTypeCount[]) => {
                this.isClientTypeLoading = false;
                this.clientTypeCount = result;
            })
    }

    //#endregion

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