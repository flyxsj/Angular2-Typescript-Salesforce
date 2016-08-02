import {Injectable} from '@angular/core';
import {Http, Headers,Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
const DEFAULT_ERROR_TEXT = 'Server error happens.Please try again.';
@Injectable()
export class HttpClient {
    http:Http;

    constructor(http:Http) {
        this.http = http;
    }

    get(url, options?:any):Promise<any> {
        let headers = new Headers();
        if (url.indexOf('?') > -1) {
            url = url + '&__r=' + (new Date().getTime());
        } else {
            url = url + '?__r=' + (new Date().getTime());
        }
        return this.http.get(url, {
                headers: headers
            })
            .toPromise()
            .then(res => {
                let body = res.json();
                let data = body;
                if (body && body.code) {
                    data = body.data;
                    if (body.code == 'error') {
                        let error = {code: 'error', message: body.message};
                        return Promise.reject(error);
                    }
                }
                return data;
            })
            .catch(error=> {
                let errorMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : DEFAULT_ERROR_TEXT;
                console.error(errorMsg);
                if (!options || !options.doNotShowCommonError) {
                    //TODO need to improve UI to show it with better user experience
                    alert(errorMsg);
                }
                return Promise.reject(errorMsg);
            });
    }

    post(url, data, options?:any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(url, data, {
                headers: headers
            })
            .toPromise()
            .then(res => {
                let body = res.json();
                let data = body;
                if (body && body.code) {
                    data = body.data;
                    if (body.code == 'error') {
                        let error = {code: 'error', message: body.message};
                        return Promise.reject(error);
                    }
                }
                return data;
            })
            .catch(error=> {
                let errorMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : DEFAULT_ERROR_TEXT;
                console.error(errorMsg);
                if (!options || !options.doNotShowCommonError) {
                    //TODO need to improve UI to show it with better user experience
                    alert(errorMsg);
                }
                return Promise.reject(errorMsg);
            });
    }

    getWithRaw(url) {
        let headers = new Headers();
        return this.http.get(url, {
            headers: headers
        });
    }

    postWithRaw(url, data) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(url, data, {
            headers: headers
        });
    }

    getWithObservable(url, options?:any):Observable<any> {
        let headers = new Headers();
        return this.http.get(url, {
                headers: headers
            })
            .map(res => {
                let body = res.json();
                let data = body;
                if (body && body.code) {
                    data = body.data;
                    if (body.code == 'error') {
                        let error = {code: 'error', message: body.message};
                        return Observable.throw(error);
                    }
                }
                return data;
            })
            .catch(error=> {
                let errorMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : DEFAULT_ERROR_TEXT;
                console.error(errorMsg);
                if (options && !options.doNotShowCommonError) {
                    alert(errorMsg);
                }
                return Observable.throw(errorMsg);
            });
    }
}