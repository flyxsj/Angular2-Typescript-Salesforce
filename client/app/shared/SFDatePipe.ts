import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sfDateFormat'})
export class SFDateFormatPipe implements PipeTransform {
    transform(value:string):string {
        if (value) {
            return value.substr(0, 16).replace('T', ' ');
        }
        return '';
    }
}