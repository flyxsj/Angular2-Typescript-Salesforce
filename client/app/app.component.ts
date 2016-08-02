import { Component,OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {EventService,HttpClient} from './shared/index';

@Component({
    selector: 'entry-app',
    providers: [HttpClient, EventService],
    directives: [ROUTER_DIRECTIVES],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
    service:EventService;
    userInfo:{
        userType:string
    } = {
        userType: ''
    };

    constructor(service:EventService) {
        this.service = service
    }

    isAdmin():boolean {
        return (this.userInfo && this.userInfo.userType == 'salesforceUser');
    }

    ngOnInit() {
        this.service.getUserType().then(
            res=> {
                this.userInfo = res;
            }
        );
    }
}
