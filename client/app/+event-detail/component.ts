import { Component, OnInit,AfterViewInit,ViewChild,ElementRef} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/forms';
import {Http, Response,HTTP_PROVIDERS,Headers} from '@angular/http';
import { ROUTER_DIRECTIVES,Router,Params} from '@angular/router';

import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdInput} from '@angular2-material/input';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MdRadioButton, MdRadioGroup,MdRadioDispatcher} from '@angular2-material/radio';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
var moment = require('moment');

import {EventService,utils,SFDateFormatPipe,StatusLabelPipe,HttpClient} from '../shared/index';
import {MyDateTimeInputComponent} from '../date-time-input/index';

@Component({
    selector: 'my-event-detail',
    templateUrl: './component.html',
    providers: [MdRadioDispatcher, MdIconRegistry, EventService, HttpClient],
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
        MdIcon,
        MyDateTimeInputComponent
    ],
    pipes: [SFDateFormatPipe, StatusLabelPipe],
    styleUrls: ['./component.scss']
})
export class EventDetailComponent implements OnInit,AfterViewInit {
    //@ViewChild('eventTitle') eventTitle:ElementRef;
    @ViewChild('description') $eventDesc;
    service:EventService;
    userInfo:{
        userType:string
    } = {
        userType: ''
    };
    eventId:string;
    event:Object = {};
    storedEvent:Object = {};
    sessionList = [];
    openSessionList = [];
    attendeeList = [];

    editingEvent:boolean = false;
    eventFormErrorText:string = '';
    eventStartDTInfo = {
        label: 'Start: ',
        date: '',
        hour: '00',
        min: '00'
    };
    eventEndDTInfo = {
        label: 'End: ',
        date: '',
        hour: '00',
        min: '00'
    };

    creatingAttendee:boolean = false;
    newAttendee:{
        FirstName:string,
        LastName:string,
        Phone:string,
        Email:string,
        Company:string,
        EventId:string
    } = {FirstName: '', LastName: '', Phone: '', Email: '', Company: '', EventId: ''};
    attendeeFormErrorText:string = '';

    creatingSession:boolean = false;
    newSession:{
        Title:string,
        Start:string,
        End:string,
        Status:string,
        RegLimit:number,
        RemainingSeats:number,
        EventId:string
    } = {Title: '', Start: '', End: '', Status: 'Open', RegLimit: 5, RemainingSeats: 5, EventId: ''};
    defaultSession = {Title: '', Start: '', End: '', Status: 'Open', RegLimit: 5, RemainingSeats: 5, EventId: ''};
    sessionFormErrorText:string = '';
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


    assigningSessionAdmin = false;
    assigningAttendeeId:string = '';
    assignedSessionInfo:Object = {};
    tmpAssignedSessionInfo:Object = {};

    registeringEvent = false;
    registeredSuccess = false;
    registerSessionIdList = [];
    registerAttendee:{
        FirstName:string,
        LastName:string,
        Phone:string,
        Email:string,
        Company:string
    } = {FirstName: '', LastName: '', Phone: '', Email: '', Company: ''};
    registerErrorText:string = '';
    registeredSessions = [];
    registeredAttendee:any = {};

    constructor(service:EventService) {
        this.service = service;
        this.initSessionDateTimeInfo();
    }

    initSessionDateTimeInfo():void {
        this.startDTInfo.date = this.endDTInfo.date = moment().format('MM/DD/YYYY');
        this.startDateTime.date = this.startDTInfo.date;
        this.startDateTime.hour = this.startDTInfo.hour;
        this.startDateTime.min = this.startDTInfo.min;
        this.endDateTime.date = this.endDTInfo.date;
        this.endDateTime.hour = this.endDTInfo.hour;
        this.endDateTime.min = this.endDTInfo.min;
    }

    ngOnInit() {
        //TODO need a better internal way to get parameter.But did not find.
        var url = window.location.href;
        this.eventId = url.split('id=')[1];
        this.service.getUserType().then(
            res=> {
                this.userInfo = res;
                this.getEventDetail();
            }
        );
    }

    ngAfterViewInit() {
    }

    showEditingEvent():void {
        this.editingEvent = true;
        this.event = JSON.parse(JSON.stringify(this.storedEvent));
        let ele = this.$eventDesc.nativeElement;
        this.event['mineentry__description__c'] = ele.innerText || ele.textContent;
    }

    chooseEventStatus(val:string):void {
        this.event['mineentry__status__c'] = val;
    }

    eventDateTimeChanged(event:any, type) {
        if (type == 'start') {
            this.eventStartDTInfo.date = event.dateTime.date;
            this.eventStartDTInfo.hour = event.dateTime.hour;
            this.eventStartDTInfo.min = event.dateTime.min;
        } else {
            this.eventEndDTInfo.date = event.dateTime.date;
            this.eventEndDTInfo.hour = event.dateTime.hour;
            this.eventEndDTInfo.min = event.dateTime.min;
        }
        if (event.dateTime.date.length > 0) {
            this.eventFormErrorText = '';
        }
    }

    updateEvent():void {
        var event = this.event;
        if (event['mineentry__title__c'].trim().length == 0) {
            this.eventFormErrorText = 'Please enter Title';
            return;
        }
        var startDT = this.eventStartDTInfo;
        var endDT = this.eventEndDTInfo;
        if (startDT.date.length == 0) {
            this.eventFormErrorText = 'Please enter Start Date';
            return;
        }
        if (endDT.date.length == 0) {
            this.eventFormErrorText = 'Please enter End Date';
            return;
        }
        let startTimestamp = moment(startDT.date + ' ' + startDT.hour + startDT.min, 'MM/DD/YYYY HHmm').unix();
        let endTimestamp = moment(endDT.date + ' ' + endDT.hour + endDT.min, 'MM/DD/YYYY HHmm').unix();
        if (endTimestamp <= startTimestamp) {
            this.eventFormErrorText = 'The End Date should be after the Start Date';
            return;
        }
        if (!(/^[0-9]+$/.test(event['mineentry__reglimit__c'] + '') && +event['mineentry__reglimit__c'] > 0)) {
            this.eventFormErrorText = 'Please enter valid Registration Limit';
            return;
        }
        if (!(/^[0-9]+$/.test(event['mineentry__remainingseats__c'] + '') && +event['mineentry__remainingseats__c'] > 0)) {
            this.eventFormErrorText = 'Please enter valid Remaining Seats';
            return;
        }
        event['mineentry__start__c'] = moment(startDT.date, 'MM/DD/YYYY').format('YYYY-MM-DD') + 'T'
            + startDT.hour + ':' + startDT.min + ':00.000';
        event['mineentry__end__c'] = moment(endDT.date, 'MM/DD/YYYY').format('YYYY-MM-DD') + 'T'
            + endDT.hour + ':' + endDT.min + ':00.000';
        var clonedEvent = JSON.parse(JSON.stringify(event));
        clonedEvent['mineentry__description__c'] = utils.escapeHtml(clonedEvent['mineentry__description__c']);
        var data = JSON.stringify(clonedEvent);
        this.service.updateEvent(data).then(
            res=> {
                this.editingEvent = false;
                this.getEventBaseInfo();
            }
        );
    }

    showCreatingAttendee():void {
        this.creatingAttendee = true;
    }

    deleteAttendee(id):void {
        this.service.deleteAttendee(id).then(
            res=> {
                this.getAttendeeList();
            }
        );
    }

    createAttendee():void {
        this.newAttendee.EventId = this.eventId;
        if (this.newAttendee.FirstName.trim().length == 0) {
            this.attendeeFormErrorText = 'Please enter First Name';
            return;
        }
        if (this.newAttendee.LastName.trim().length == 0) {
            this.attendeeFormErrorText = 'Please enter Last Name';
            return;
        }
        if (this.newAttendee.Email.trim().length == 0) {
            this.attendeeFormErrorText = 'Please enter Email';
            return;
        }
        if (this.newAttendee.Phone.trim().length == 0) {
            this.attendeeFormErrorText = 'Please enter Phone';
            return;
        }
        if (!utils.isValidEmail(this.newAttendee.Email)) {
            this.attendeeFormErrorText = 'Please enter valid Email';
            return;
        }
        var data = JSON.stringify(this.newAttendee);
        this.service.createAttendee(data).then(
            res=> {
                for (var key in this.newAttendee) {
                    if (key != 'EventId') {
                        this.newAttendee[key] = '';
                    }
                }
                this.creatingAttendee = false;
                this.getAttendeeList();
            }
        );
    }

    showCreatingSession():void {
        this.creatingSession = true;
        this.initSessionDateTimeInfo();
    }

    sessionDateTimeChanged(event:any, type) {
        if (type == 'start') {
            this.startDateTime = event.dateTime;
        } else {
            this.endDateTime = event.dateTime;
        }
        if (event.dateTime.date.length > 0) {
            this.sessionFormErrorText = '';
        }
    }

    deleteSession(id):void {
        this.service.deleteSession(id).then(
            res=> {
                this.getSessionList();
                this.getAttendeeList();
            }
        );
    }

    createSession():void {
        this.newSession.EventId = this.eventId;
        if (this.newSession.Title.trim().length == 0) {
            this.sessionFormErrorText = 'Please enter Title';
            return;
        }
        if (this.startDateTime.date.length == 0) {
            this.sessionFormErrorText = 'Please enter Start Date';
            return;
        }
        if (this.endDateTime.date.length == 0) {
            this.sessionFormErrorText = 'Please enter End Date';
            return;
        }
        let startTimestamp = moment(this.startDateTime.date + ' ' + this.startDateTime.hour + this.startDateTime.min, 'MM/DD/YYYY HHmm').unix();
        let endTimestamp = moment(this.endDateTime.date + ' ' + this.endDateTime.hour + this.endDateTime.min, 'MM/DD/YYYY HHmm').unix();
        if (endTimestamp <= startTimestamp) {
            this.sessionFormErrorText = 'The End Date should be after the Start Date';
            return;
        }
        if (!(/^[0-9]+$/.test(this.newSession.RegLimit + '') && this.newSession.RegLimit > 0)) {
            this.sessionFormErrorText = 'Please enter valid Registration Limit';
            return;
        }
        if (!(/^[0-9]+$/.test(this.newSession.RemainingSeats + '') && this.newSession.RemainingSeats > 0)) {
            this.sessionFormErrorText = 'Please enter valid Remaining Seats';
            return;
        }
        this.newSession.Start = moment(this.startDateTime.date, 'MM/DD/YYYY').format('YYYY-MM-DD') + 'T'
            + this.startDateTime.hour + ':' + this.startDateTime.min + ':00.000';
        this.newSession.End = moment(this.endDateTime.date, 'MM/DD/YYYY').format('YYYY-MM-DD') + 'T'
            + this.endDateTime.hour + ':' + this.endDateTime.min + ':00.000';
        var data = JSON.stringify(this.newSession);
        this.service.createSession(data).then(
            res=> {
                this.newSession = JSON.parse(JSON.stringify(this.defaultSession));
                this.creatingSession = false;
                this.getSessionList();
            }
        );
    }

    chooseSessionStatus(val):void {
        this.newSession.Status = val;
    }

    showReassignSessionArea(attendeeId):void {
        this.getAssignedSessionList(attendeeId);
        this.assigningSessionAdmin = true;
        this.assigningAttendeeId = attendeeId;
    }

    isAssigned(attendeeId, sessionId):boolean {
        let list = this.assignedSessionInfo[attendeeId];
        if (list && list.length > 0) {
            for (let sessionItem of list) {
                if (sessionId == sessionItem.mineentry__sessionid__c) {
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    getAssignedNumber(attendeeId):number {
        let list = this.assignedSessionInfo[attendeeId];
        if (list && list.length > 0) {
            return list.length;
        } else {
            return 0;
        }
    }

    checkSession(attendeeId, sessionId, checked):void {
        let list = this.tmpAssignedSessionInfo[attendeeId];
        if (list && list.length > 0) {
            if (!checked) {
                let newList = [];
                for (let sessionItem of list) {
                    if (sessionId != sessionItem.mineentry__sessionid__c) {
                        newList.push(sessionItem);
                    }
                }
                this.tmpAssignedSessionInfo[attendeeId] = newList;
            } else {
                list.push({
                    "mineentry__sessionid__c": sessionId
                });
            }
        } else {
            if (checked) {
                let newList = [];
                newList.push({
                    "mineentry__sessionid__c": sessionId
                });
                this.tmpAssignedSessionInfo[attendeeId] = newList;
            }
        }
    }

    assignSession(attendeeId):void {
        let list = this.tmpAssignedSessionInfo[attendeeId];
        let data = {
            "eventId": this.eventId,
            "attendeeId": attendeeId,
            "sessionList": []
        };
        if (list && list.length > 0) {
            data.sessionList = list;
        }
        this.service.assignSessions(JSON.stringify(data)).then(
            res=> {
                this.assigningSessionAdmin = false;
                this.getAssignedSessionList(attendeeId);
            }
        );
    }

    getEventDetail():void {
        this.getEventBaseInfo();
        this.getSessionList();
        if (this.isAdmin()) {
            this.getAttendeeList();
        } else {
            this.getRegisteredSessions();
        }
    }

    getSessionTitle(sessionId):string {
        for (let session of this.sessionList) {
            if (session.id == sessionId) {
                return session.mineentry__title__c;
            }
        }
        return '';
    }

    getRegisteredSessions():void {
        this.service.getRegisteredSessions(this.eventId).then(
            res=> {
                this.registeredSessions = res;
                if (this.registeredSessions.length > 0) {
                    let attendeeId = this.registeredSessions[0].mineentry__attendeeid__c;
                    this.service.getAttendeeEntity(attendeeId).then(
                        res2=> {
                            if (res2.length > 0) {
                                this.registeredAttendee = res2[0];
                            }
                        }
                    );
                }
            }
        );
    }

    private getEventBaseInfo() {
        this.service.getEventBase(this.eventId).then(
            res=> {
                if (res && res.length == 1) {
                    this.event = res[0];
                    this.storedEvent = res[0];
                    fillDateTime(this.eventStartDTInfo, this.event['mineentry__start__c']);
                    fillDateTime(this.eventEndDTInfo, this.event['mineentry__end__c']);
                }
            }
        );
        function fillDateTime(dtObj, text) {
            if (text && text.length >= 16) {
                var date = text.substr(0, 10);
                var time = text.substr(11, 5);
                dtObj['date'] = moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
                dtObj['hour'] = time.split(':')[0];
                dtObj['min'] = time.split(':')[1];
            }
        }
    };

    getAttendeeList():void {
        this.service.getAttendeeList(this.eventId).then(
            res=> {
                this.attendeeList = res;
                for (let attendee of this.attendeeList) {
                    this.getAssignedSessionList(attendee.id);
                }
            }
        );
    };

    getSessionList():void {
        this.service.getSessionList(this.eventId).then(
            res=> {
                this.sessionList = res;
                this.openSessionList = [];
                for (let item of this.sessionList) {
                    if (item.mineentry__status__c == 'Open') {
                        this.openSessionList.push(item);
                    }
                }
            }
        );
    };

    isAdmin():boolean {
        return (this.userInfo && this.userInfo.userType == 'salesforceUser');
    }

    allowRegistered():boolean {
        return this.event && this.event['mineentry__status__c'] == 'Open';
    }

    checkRegisteredSession(sessionId, checked):void {
        if (checked) {
            this.registerSessionIdList.push(sessionId);
        } else {
            var index = this.registerSessionIdList.indexOf(sessionId);
            if (index > -1) {
                this.registerSessionIdList.splice(index, 1);
            }
        }
        this.registerErrorText = '';
        console.log(this.registerSessionIdList);
    }

    isSelected4Register(sessionId):boolean {
        return this.registerSessionIdList.indexOf(sessionId) > -1;
    }

    registerSessions():void {
        if (this.registerSessionIdList.length == 0) {
            this.registerErrorText = 'Please select sessions which you want to register';
            return;
        }
        if (this.registerAttendee.FirstName.trim().length == 0) {
            this.registerErrorText = 'Please enter First Name';
            return;
        }
        if (this.registerAttendee.LastName.trim().length == 0) {
            this.registerErrorText = 'Please enter Last Name';
            return;
        }
        if (this.registerAttendee.Email.trim().length == 0) {
            this.registerErrorText = 'Please enter Email';
            return;
        }
        if (this.registerAttendee.Phone.trim().length == 0) {
            this.registerErrorText = 'Please enter Phone';
            return;
        }
        if (!utils.isValidEmail(this.registerAttendee.Email)) {
            this.registerErrorText = 'Please enter valid Email';
            return;
        }
        var obj = {
            sessionIdList: this.registerSessionIdList,
            eventId: this.eventId,
            attendee: this.registerAttendee
        };
        var data = JSON.stringify(obj);
        this.service.registerSessions(data).then(
            res=> {
                this.registeringEvent = false;
                this.registeredSuccess = true;
                this.getRegisteredSessions();
            }
        );
    }

    private getAssignedSessionList(attendeeId) {
        this.service.getAssignedSessionList(attendeeId).then(
            res=> {
                this.assignedSessionInfo[attendeeId] = res;
                this.tmpAssignedSessionInfo[attendeeId] = JSON.parse(JSON.stringify(res));
            }
        );
    };
}