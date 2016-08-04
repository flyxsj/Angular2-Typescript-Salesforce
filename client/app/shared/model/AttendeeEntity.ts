import {utils} from '../../shared/index';
export class AttendeeEntity {
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    company:string;

    constructor(obj?:AttendeeEntity) {
        this.init(obj);
    }

    init(obj?:AttendeeEntity):void {
        if (obj) {
            this.firstName = obj.firstName;
            this.lastName = obj.lastName;
            this.phone = obj.phone;
            this.email = obj.email;
            this.company = obj.company;
        } else {
            this.firstName = '';
            this.lastName = '';
            this.phone = '';
            this.email = '';
            this.company = '';
        }
    }

    verify():string {
        if (this.firstName.trim().length == 0) {
            return 'Please enter First Name';
        }
        if (this.lastName.trim().length == 0) {
            return 'Please enter Last Name';
        }
        if (this.email.trim().length == 0) {
            return 'Please enter Email';
        }
        if (!utils.isValidEmail(this.email)) {
            return 'Please enter valid Email';
        }
        if (this.phone.trim().length == 0) {
            return 'Please enter Phone';
        }
        return '';
    }
}