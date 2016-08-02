import { Component,provide } from '@angular/core';
import { provideRouter, RouterConfig } from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';

import { EventListComponent } from './+event-list/index';
import { EventDetailComponent } from './+event-detail/index';

export const routes:RouterConfig = [
    {path: '', component: EventListComponent},
    {path: 'detail', component: EventDetailComponent},
];

export const APP_ROUTER_PROVIDERS = [
    HTTP_PROVIDERS,
    provideRouter(routes),
    provide(LocationStrategy, {useClass: HashLocationStrategy})
];
