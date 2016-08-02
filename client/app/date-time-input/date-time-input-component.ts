import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange } from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/forms';
import { ROUTER_DIRECTIVES,Router} from '@angular/router';
import {Http, Response,HTTP_PROVIDERS,Headers} from '@angular/http';

import {MyDatePicker} from '../my-date-picker/index';

@Component({
    selector: 'my-date-time-input',
    templateUrl: './date-time-input-component.html',
    providers: [],
    directives: [
        MyDatePicker
    ],
    pipes: [],
    styleUrls: ['./date-time-input-component.scss']
})
export class MyDateTimeInputComponent implements OnInit,OnChanges {
    @Input() labelText:string = '';
    @Input() selectedHour:string = '00';
    @Input() selectedMin:string = '00';
    @Input() selectedDate:string = '';
    @Output() dateTimeChanged:EventEmitter<Object> = new EventEmitter();

    hourRanges = [];
    minRanges = [];
    dateTime = {
        date: '',
        hour: '00',
        min: '00'
    };
    myDatePickerOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: false,
        height: '30px',
        width: '155px',
    };

    constructor() {
        for (let i = 0; i < 24; i++) {
            this.hourRanges.push(i);
        }
        for (let i = 0; i < 60; i++) {
            if (i % 5 == 0) {
                this.minRanges.push(i);
            }
        }
        var moment = require('moment');
        if (this.selectedDate.length == 0) {
            this.selectedDate = moment().format('MM/DD/YYYY');
        }
    }

    ngOnChanges(changes:{[propName: string]: SimpleChange}) {
        if (changes.hasOwnProperty('selectedHour')) {
            this.dateTime.hour = changes['selectedHour'].currentValue;
        }
        if (changes.hasOwnProperty('selectedMin')) {
            this.dateTime.min = changes['selectedMin'].currentValue;
        }
        if (changes.hasOwnProperty('selectedDate')) {
            this.dateTime.date = changes['selectedDate'].currentValue;
        }
    }

    ngOnInit() {
        this.dateTime.date = this.selectedDate;
        this.dateTime.hour = this.selectedHour;
        this.dateTime.min = this.selectedMin;
    }

    onDateChanged(event:any) {
        this.dateTime.date = event.formatted;
        this.dateTimeChanged.emit({dateTime: this.dateTime});
    }

    onTimeChanged(num:any, type:string) {
        num = (+num);
        num = (num > 9 ? num : ('0' + num));
        if (type == 'hour') {
            this.dateTime.hour = num + '';
        }
        if (type == 'min') {
            this.dateTime.min = num + '';
        }
        this.dateTimeChanged.emit({dateTime: this.dateTime});
    }
}
