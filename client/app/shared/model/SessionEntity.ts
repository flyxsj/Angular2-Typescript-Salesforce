import IBaseInfo from "./BaseInfo.interface";
import {BaseInfo} from "./BaseInfo";
import IBaseInfo from "./BaseInfo.interface";
var moment = require('moment');

/**
 * Created by Steven
 */
export class SessionEntity extends BaseInfo {

    constructor(base?:IBaseInfo) {
        super();
        this.init(base);
    }

    init(obj?:IBaseInfo):void {
        if (!obj) {
            obj = {
                title: '',
                limit: 5,
                seats: 5,
                start: new Date(),
                end: new Date(),
                status: 'Open',
            };
        }
        super.init(obj);
    }
}