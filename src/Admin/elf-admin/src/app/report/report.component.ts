import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ClientTypeCount, LinkTrackingDateCount, MostRequestedLinkCount, ReportService, RequestTrack } from './report.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    ENV = environment;
    pipe = new DatePipe('en-US');
    @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;
    public gridView: any[];
    public requestTrack: RequestTrack[] = [];

    chartDateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl(new Date())
    });

    constructor(private service: ReportService) {
    }

    ngOnInit(): void {
        var date = new Date();
        date.setDate(date.getDate() - 7);
        this.chartDateRange.controls['start'].setValue(date);
        this.getData();
    }

    getData() {
        this.getRecentRequests();
        this.getChartData();
    }

    getChartData() {
        this.getTrackingCount();
        this.getClientType();
        this.getMostRequestedLinks();
    }

    clearTrackingData() {
        this.service.clearTrackingData().subscribe(() => {
            this.getData();
        });
    }

    //#region mostRequestedChart

    mostRequestedChartData: ChartConfiguration['data'] = {
        datasets: [],
        labels: []
    };

    mostRequestedChartOptions: ChartConfiguration['options'] = {
        plugins: {
            legend: {
                display: true,
                position: 'right'
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    isMostRequestedLinksLoading: boolean;
    getMostRequestedLinks() {
        this.isMostRequestedLinksLoading = true;
        this.service
            .mostRequestedLinks({
                startDateUtc: this.chartDateRange.value.start,
                endDateUtc: this.chartDateRange.value.end!.toISOString()
            })
            .subscribe((result: MostRequestedLinkCount[]) => {
                this.isMostRequestedLinksLoading = false;

                const notes = [];
                const requestCounts: number[] = [];

                for (let idx in result) {
                    if (result.hasOwnProperty(idx)) {
                        notes.push(result[idx].note);
                        requestCounts.push(result[idx].requestCount);
                    }
                }

                this.mostRequestedChartData.datasets = [{
                    data: requestCounts
                }];

                this.mostRequestedChartData.labels = notes;

                this.charts?.forEach((child) => {
                    child.update();
                });
            })
    }

    //#endregion

    //#region clientTypeChart

    clientTypeChartData: ChartConfiguration['data'] = {
        datasets: [],
        labels: []
    };

    clientTypeChartOptions: ChartConfiguration['options'] = {
        plugins: {
            legend: {
                display: true,
                position: 'right'
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    isClientTypeLoading: boolean;
    getClientType() {
        this.isClientTypeLoading = true;
        this.service
            .clientType({
                startDateUtc: this.chartDateRange.value.start,
                endDateUtc: this.chartDateRange.value.end!.toISOString()
            })
            .subscribe((result: ClientTypeCount[]) => {
                this.isClientTypeLoading = false;

                const clientTypes = [];
                const clientCounts: number[] = [];

                for (let idx in result) {
                    if (result.hasOwnProperty(idx)) {
                        clientTypes.push(result[idx].clientTypeName);
                        clientCounts.push(result[idx].count);
                    }
                }

                this.clientTypeChartData.datasets = [{
                    data: clientCounts
                }];

                this.clientTypeChartData.labels = clientTypes;

                this.charts?.forEach((child) => {
                    child.update();
                });
            })
    }

    //#endregion

    //#region trackingCountChart

    trackingCountChartData: ChartConfiguration['data'] = {
        datasets: [],
        labels: []
    };

    trackingCountChartOptions: ChartConfiguration['options'] = {
        plugins: {
            legend: { display: false }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    isTrackingCountLoading: boolean;
    getTrackingCount() {
        this.isTrackingCountLoading = true;

        this.service
            .trackingCount({
                startDateUtc: this.chartDateRange.value.start,
                endDateUtc: this.chartDateRange.value.end!.toISOString()
            })
            .subscribe((result: LinkTrackingDateCount[]) => {
                this.isTrackingCountLoading = false;

                const trackingDates = [];
                const requestCounts: number[] = [];
                for (let idx in result) {
                    if (result.hasOwnProperty(idx)) {
                        trackingDates.push(this.pipe.transform(result[idx].trackingDateUtc, 'MM/dd'));
                        requestCounts.push(result[idx].requestCount);
                    }
                }

                this.trackingCountChartData.datasets = [{
                    data: requestCounts
                }];

                this.trackingCountChartData.labels = trackingDates;

                this.charts?.forEach((child) => {
                    child.update();
                });
            })
    }

    //#endregion

    //#region RecentRequests

    isRecentRequestsLoading = false;
    getRecentRequests() {
        this.isRecentRequestsLoading = true;

        this.service.recentRequests(100, 0).subscribe((result: RequestTrack[]) => {
            this.isRecentRequestsLoading = false;
            this.requestTrack = result;
            this.gridView = this.requestTrack;
        })
    }

    //#endregion
}