import IBaseInfo from "./BaseInfo.interface";

export class BaseInfo {
    title:string;
    status:string;
    start:Date;
    end:Date;
    limit:number;
    seats:number;

    init(obj:IBaseInfo):void {
        this.title = obj.title;
        this.limit = obj.limit;
        this.seats = obj.seats;
        this.status = obj.status;
        this.start = obj.start;
        this.end = obj.end;
        this.handleDate(this.start);
        this.handleDate(this.end);
    }

    handleDate(date:Date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    }

    verify():string {
        if (this.title.trim().length == 0) {
            return 'Please enter Title';
        }
        if (this.start == null) {
            return 'Please enter Start Date';
        }
        if (this.end == null) {
            return 'Please enter End Date';
        }
        if (!(/^[0-9]+$/.test(this.limit + '') && +this.limit > 0)) {
            return 'Please enter valid Registration Limit';
        }
        if (!(/^[0-9]+$/.test(this.seats + '') && +this.seats > 0)) {
            return 'Please enter valid Remaining Seats';
        }
        if (this.end.getTime() <= this.start.getTime()) {
            return 'The End Date should be after the Start Date';
        }
        return '';
    }
}