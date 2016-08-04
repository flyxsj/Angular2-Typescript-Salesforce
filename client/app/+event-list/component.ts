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
import {EventEntity} from "../shared/model/index";

import {EventService,HttpClient,SFDateFormatPipe,StatusLabelPipe} from '../shared/index';
import {MyDateTimeInputComponent} from '../date-time-input/index';

var moment = require('moment');
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
    event:EventEntity = new EventEntity();
    //initEvent = JSON.parse(JSON.stringify(this.event));

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
        this.initDateTimeInfo();
    }

    initDateTimeInfo():void {
        this.startDTInfo.date = this.endDTInfo.date = moment().format('MM/DD/YYYY');
        this.startDTInfo.hour = '00';
        this.startDTInfo.min = '00';
        this.startDateTime.date = this.startDTInfo.date;
        this.startDateTime.hour = this.startDTInfo.hour;
        this.startDateTime.min = this.startDTInfo.min;
        this.endDateTime.date = this.endDTInfo.date;
        this.endDateTime.hour = this.endDTInfo.hour;
        this.endDateTime.min = this.endDTInfo.min;
    }

    dateTimeChanged(event:any, type) {
        let m = moment(event.dateTime.date + ' ' + event.dateTime.hour + ':' + event.dateTime.min, 'MM/DD/YYYY HH:mm');
        let date:Date;
        if (type == 'start') {
            date = this.event.start;
            //this.startDateTime = event.dateTime;
        } else {
            date = this.event.end;
            //this.endDateTime = event.dateTime;
        }
        date.setFullYear(m.year());
        date.setMonth(m.month());
        date.setDate(m.date());
        date.setHours(m.hour());
        date.setMinutes(m.minute());
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

    showAddingEvent():void {
        this.eventFormErrorText = '';
        this.addingEvent = true;
        this.initDateTimeInfo();
    }

    cancelAddingEvent():void {
        this.addingEvent = false;
        this.event.init();
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

    getDateTimePartText(date:Date, type:string):string {
        if (date) {
            if (type == 'date') {
                return moment(date).format('MM/DD/YYYY');
            }
            if (type == 'hour') {
                return moment(date).format('HH');
            }
            if (type == 'min') {
                return moment(date).format('mm');
            }
        }
        return '';
    }

    createEvent():void {
        let event = this.event;
        this.eventFormErrorText = event.verify();
        if (this.eventFormErrorText.length > 0) {
            return;
        }
        var entity = JSON.parse(JSON.stringify(event));
        delete entity.start;
        entity.start = moment(event.start).format('YYYY-MM-DDTHH:mm:00.000');
        delete entity.end;
        entity.end = moment(event.end).format('YYYY-MM-DDTHH:mm:00.000');
        var data = JSON.stringify(entity);
        this.service.createEvent(data).then(
            res=> {
                this.getEventList();
                this.addingEvent = false;
                this.event.init();
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
