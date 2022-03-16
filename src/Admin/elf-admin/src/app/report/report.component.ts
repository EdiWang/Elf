import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ClientTypeCount, LinkTrackingDateCount, MostRequestedLinkCount, ReportService, RequestTrack } from './report.service';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    isLoading = false;

    pipe = new DatePipe('en-US');
    displayedColumns: string[] = ['fwToken', 'note', 'userAgent', 'ipAddress', 'requestTimeUtc'];
    dataSource: MatTableDataSource<RequestTrack> = new MatTableDataSource();

    pastWeekChartData: ChartConfiguration['data'] = {
        datasets: [],
        labels: []
    };

    pastWeekChartOptions: ChartConfiguration['options'] = {
        plugins: {
            legend: { display: false }
        }
    };

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
        }
    };

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
        }
    };

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;

    constructor(private service: ReportService) {
    }

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        this.getRecentRequests();
        this.getTrackingCountPastWeek();
        this.getClientTypePastMonth();
        this.getMostRequestedLinksPastMonth();
    }

    clearTrackingData() {
        this.service.clearTrackingData().subscribe(() => {
            this.getData();
        });
    }

    getMostRequestedLinksPastMonth() {
        this.isLoading = true;
        this.service.mostRequestedLinksPastMonth().subscribe((result: MostRequestedLinkCount[]) => {
            this.isLoading = false;

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

    getClientTypePastMonth() {
        this.isLoading = true;
        this.service.clientTypePastMonth().subscribe((result: ClientTypeCount[]) => {
            this.isLoading = false;

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

    getTrackingCountPastWeek() {
        this.isLoading = true;
        this.service.trackingCountPastWeek().subscribe((result: LinkTrackingDateCount[]) => {
            this.isLoading = false;

            const trackingDates = [];
            const requestCounts: number[] = [];
            for (let idx in result) {
                if (result.hasOwnProperty(idx)) {
                    trackingDates.push(this.pipe.transform(result[idx].trackingDateUtc, 'MM/dd'));
                    requestCounts.push(result[idx].requestCount);
                }
            }

            this.pastWeekChartData.datasets = [{
                data: requestCounts
            }];

            this.pastWeekChartData.labels = trackingDates;

            this.charts?.forEach((child) => {
                child.update();
            });
        })
    }

    getRecentRequests() {
        this.isLoading = true;

        this.service.recentRequests().subscribe((result: RequestTrack[]) => {
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(result);
            this.dataSource.paginator = this.paginator;
        })
    }
}