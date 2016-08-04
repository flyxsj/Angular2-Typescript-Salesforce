import IBaseInfo from "./BaseInfo.interface";
import {BaseInfo} from "./BaseInfo";
var moment = require('moment');

/**
 * Created by Steven
 */
export class EventEntity extends BaseInfo {
    description:string;

    constructor(base?:IBaseInfo) {
        super();
        this.init(base);
    }

    init(obj?:IBaseInfo):void {
        if (!obj) {
            obj = {
                title: '',
                limit: 10,
                seats: 10,
                start: new Date(),
                end: new Date(),
                status: 'Open',
                description: ''
            };
        }
        super.init(obj);
        this.description = obj.description;
    }
}