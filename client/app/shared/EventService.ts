import { Injectable } from '@angular/core';
import {Http, Response,HTTP_PROVIDERS,Headers} from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import {HttpClient} from './HttpClient';

@Injectable()
export class EventService {
    httpClient:HttpClient;

    constructor(httpClient:HttpClient) {
        this.httpClient = httpClient;
    }

    getUserType(options?:any):Promise<any> {
        return this.httpClient.get('/rest/user', options);
    }

    getEventBase(eventId:string, options?:any):Promise<any> {
        return this.httpClient.get('/rest/event/detail?id=' + eventId, options);
    }

    getEventList(options?:any):Promise<any> {
        return this.httpClient.get('/rest/event/list', options);
    }

    createEvent(data, options?:any) {
        return this.httpClient.post('/rest/event/create', data, options);
    }

    deleteEvent(eventId:string, options?:any) {
        return this.httpClient.get('/rest/event/delete?id=' + eventId, options);
    }

    updateEvent(data, options?:any) {
        return this.httpClient.post('/rest/event/update', data, options);
    }

    deleteAttendee(id, options?:any) {
        return this.httpClient.get('/rest/attendee/delete?id=' + id, options);
    }

    createAttendee(data, options?:any) {
        return this.httpClient.post('/rest/attendee/create', data, options);
    }

    deleteSession(id, options?:any) {
        return this.httpClient.get('/rest/session/delete?id=' + id, options);
    }

    createSession(data, options?:any) {
        return this.httpClient.post('/rest/session/create', data, options);
    }

    assignSessions(data, options?:any) {
        return this.httpClient.post('/rest/event/detail/attendee/assignSession', data, options);
    }

    getAttendeeList(eventId:string, options?:any):Promise<any> {
        return this.httpClient.get('/rest/event/detail/attendees?id=' + eventId);
    }

    getSessionList(eventId:string, options?:any):Promise<any> {
        return this.httpClient.get('/rest/event/detail/sessions?id=' + eventId);
    }

    getAssignedSessionList(attendeeId:string, options?:any):Promise<any> {
        return this.httpClient.get('/rest/event/detail/attendee/assignedSessionList?attendeeId=' + attendeeId);
    }

    registerSessions(data, options?:any) {
        return this.httpClient.post('/rest/event/registerSession', data, options);
    }

    getAttendeeEntity(attendeeId, options?:any) {
        return this.httpClient.get('/rest/event/detail/getAttendeeEntity?attendeeId=' + attendeeId);
    }

    getRegisteredSessions(eventId, options?:any) {
        return this.httpClient.get('/rest/event/detail/getRegisteredSessions?eventId=' + eventId);
    }

}
