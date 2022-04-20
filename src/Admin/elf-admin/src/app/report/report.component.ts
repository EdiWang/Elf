import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ClientTypeCount, LinkTrackingDateCount, MostRequestedLinkCount, ReportService, RequestTrack } from './report.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    pipe = new DatePipe('en-US');
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;

    constructor(private service: ReportService) {
    }

    ngOnInit(): void {
        var date = new Date();
        date.setDate(date.getDate() - 7);
        this.trackingCountDateRange.controls['start'].setValue(date);
        this.clientTypeDateRange.controls['start'].setValue(date);
        this.mostRequestedDateRange.controls['start'].setValue(date);

        this.getData();
    }

    getData() {
        this.getRecentRequests();
        this.getTrackingCount();
        this.getClientType();
        this.getMostRequestedLinksPastMonth();
    }

    clearTrackingData() {
        this.service.clearTrackingData().subscribe(() => {
            this.getData();
        });
    }

    //#region mostRequestedChart

    mostRequestedDateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl(new Date()),
    });

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
    getMostRequestedLinksPastMonth() {
        this.isMostRequestedLinksLoading = true;
        this.service
            .mostRequestedLinks(this.mostRequestedDateRange.value.start, this.mostRequestedDateRange.value.end)
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

    clientTypeDateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl(new Date()),
    });

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
            .clientType(this.clientTypeDateRange.value.start, this.clientTypeDateRange.value.end)
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

    trackingCountDateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl(new Date()),
    });

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
            .trackingCount(this.trackingCountDateRange.value.start, this.trackingCountDateRange.value.end)
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

    displayedColumns: string[] = [
        'fwToken',
        'note',
        'userAgent',
        'ipAddress',
        'ipCountry',
        'ipRegion',
        'ipCity',
        'ipasn',
        'ipOrg',
        'requestTimeUtc'
    ];
    dataSource: MatTableDataSource<RequestTrack> = new MatTableDataSource();

    isRecentRequestsLoading = false;
    getRecentRequests() {
        this.isRecentRequestsLoading = true;

        this.service.recentRequests(128, 0).subscribe((result: RequestTrack[]) => {
            this.isRecentRequestsLoading = false;
            this.dataSource = new MatTableDataSource(result);
            this.dataSource.paginator = this.paginator;
        })
    }

    //#endregion
}