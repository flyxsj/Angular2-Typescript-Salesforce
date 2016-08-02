'use strict';

const utils = {
    statusOptions: [
        {
            label: 'Open',
            value: 'Open',
        },
        {
            label: 'Draft',
            value: 'Draft',
        },
        {
            label: 'Sold Out',
            value: 'SoldOut',
        },
        {
            label: 'Closed',
            value: 'Closed',
        }
    ],
    isValidEmail(email:string): boolean{
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(email);
    },
    escapeHtml(html:string): string {
        if (!html) {
            return '';
        }
        return html
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};
export {utils};
