import { Component, OnInit } from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/forms';
import { ROUTER_DIRECTIVES,Router} from '@angular/router';
import {Http, Response,HTTP_PROVIDERS,Headers} from '@angular/http';

import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdInput} from '@angular2-material/input';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MdRadioButton, MdRadioGroup,MdRadioDispatcher} from '@angular2-material/radio';
var moment = require('moment');

import {EventService,HttpClient,SFDateFormatPipe,StatusLabelPipe} from '../shared/index';
import {MyDateTimeInputComponent} from '../date-time-input/index';

@Component({
    selector: 'my-event-list',
    templateUrl: './component.html',
    providers: [HTTP_PROVIDERS, MdRadioDispatcher, HttpClient, EventService],
    directives: [
        ROUTER_DIRECTIVES,
        MD_SIDENAV_DIRECTIVES,
        MD_LIST_DIRECTIVES,
        MD_CARD_DIRECTIVES,
        MdToolbar,
        MdButton,
        MdInput,
        MdCheckbox,
        MdRadioGroup,
        MdRadioButton,
        MyDateTimeInputComponent
    ],
    pipes: [SFDateFormatPipe, StatusLabelPipe],
    styleUrls: ['./component.scss']
})
export class EventListComponent implements OnInit {
    httpClient:HttpClient;
    service:EventService;
    userInfo:{
        userType:string
    } = {
        userType: ''
    };
    eventList = [];
    addingEvent:boolean = false;
    eventFormErrorText:string = '';
    event:{
        title: string,
        status:string,
        start:string,
        end:string,
        limit:number,
        seats:number,
        description:string
    } = {
        title: '',
        status: 'Open',
        start: '',
        end: '',
        limit: 5,
        seats: 5,
        description: ''
    };
    initEvent = JSON.parse(JSON.stringify(this.event));

    startDTInfo = {
        label: 'Start: ',
        date: '',
        hour: '00',
        min: '00'
    };
    endDTInfo = {
        label: 'End: ',
        date: '',
        hour: '00',
        min: '00'
    };
    startDateTime:{
        date:string,
        hour:string,
        min:string
    } = {date: '', hour: '', min: ''};
    endDateTime:{
        date:string,
        hour:string,
        min:string
    } = {date: '', hour: '', min: ''};

    constructor(httpClient:HttpClient, service:EventService, private _router:Router) {
        this.httpClient = httpClient;
        this.service = service;
        this.startDTInfo.date = this.endDTInfo.date = moment().format('MM/DD/YYYY');
        this.startDateTime.date = this.startDTInfo.date;
        this.startDateTime.hour = this.startDTInfo.hour;
        this.startDateTime.min = this.startDTInfo.min;
        this.endDateTime.date = this.endDTInfo.date;
        this.endDateTime.hour = this.endDTInfo.hour;
        this.endDateTime.min = this.endDTInfo.min;
    }

    dateTimeChanged(event:any, type) {
        if (type == 'start') {
            this.startDateTime = event.dateTime;
        } else {
            this.endDateTime = event.dateTime;
        }
        if (event.dateTime.date.length > 0) {
            this.eventFormErrorText = '';
        }
    }

    ngOnInit() {
        this.service.getUserType().then(
            res=> {
                this.userInfo = res;
                this.getEventList();
            }
        );
    }

    getEventList():void {
        this.service.getEventList().then(
            res=> {
                if (this.isAdmin()) {
                    this.eventList = res
                } else {
                    for (let event of res) {
                        if (event.mineentry__status__c != 'Draft') {
                            this.eventList.push(event);
                        }
                    }
                }
            },
            error=> {
            }
        );
    }

    isAdmin():boolean {
        return (this.userInfo && this.userInfo.userType == 'salesforceUser');
    }

    createEvent():void {
        var event = this.event;
        if (event.title.trim().length == 0) {
            this.eventFormErrorText = 'Please enter Title';
            return;
        }
        if (this.startDateTime.date.length == 0) {
            this.eventFormErrorText = 'Please enter Start Date';
            return;
        }
        if (this.endDateTime.date.length == 0) {
            this.eventFormErrorText = 'Please enter End Date';
            return;
        }
        let startTimestamp = moment(this.startDateTime.date + ' ' + this.startDateTime.hour + this.startDateTime.min, 'MM/DD/YYYY HHmm').unix();
        let endTimestamp = moment(this.endDateTime.date + ' ' + this.endDateTime.hour + this.endDateTime.min, 'MM/DD/YYYY HHmm').unix();
        if (endTimestamp <= startTimestamp) {
            this.eventFormErrorText = 'The End Date should be after the Start Date';
            return;
        }
        if (!(/^[0-9]+$/.test(event.limit + '') && +event.limit > 0)) {
            this.eventFormErrorText = 'Please enter valid Registration Limit';
            return;
        }
        if (!(/^[0-9]+$/.test(event.seats + '') && +event.seats > 0)) {
            this.eventFormErrorText = 'Please enter valid Remaining Seats';
            return;
        }
        event.start = moment(this.startDateTime.date, 'MM/DD/YYYY').format('YYYY-MM-DD') + 'T'
            + this.startDateTime.hour + ':' + this.startDateTime.min + ':00.000';
        event.end = moment(this.endDateTime.date, 'MM/DD/YYYY').format('YYYY-MM-DD') + 'T'
            + this.endDateTime.hour + ':' + this.endDateTime.min + ':00.000';
        var data = JSON.stringify(this.event);
        this.service.createEvent(data).then(
            res=> {
                this.getEventList();
                this.addingEvent = false;
                this.event = JSON.parse(JSON.stringify(this.initEvent));
            },
            error => {
            }
        );
    }

    deleteEvent(id):void {
        this.service.deleteEvent(id).then(
            res=>this.getEventList(),
            error=> {
            }
        );
    }

    chooseStatus(val):void {
        this.event.status = val;
    }
}
