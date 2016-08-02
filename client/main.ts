import { enableProdMode } from '@angular/core';
import { disableDeprecatedForms,provideForms } from '@angular/forms';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app/app.component';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';

require('./style/base.scss');

//if (process.env.ENV === 'build') {
enableProdMode();
//}
bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms(),
    APP_ROUTER_PROVIDERS,
]).catch(err => console.error(err));

