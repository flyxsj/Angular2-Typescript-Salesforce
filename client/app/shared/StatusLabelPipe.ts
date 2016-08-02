import { Pipe, PipeTransform } from '@angular/core';
import {utils} from '../shared/utils';

@Pipe({name: 'statusLabel'})
export class StatusLabelPipe implements PipeTransform {
    transform(value:string):string {
        if (value) {
            let options = utils.statusOptions;
            let label = '';
            for (let i = 0; i < options.length; i++) {
                let option = options[i];
                if (option.value == value) {
                    label = option.label;
                    break;
                }
            }
            return label;
        }
        return '';
    }
}