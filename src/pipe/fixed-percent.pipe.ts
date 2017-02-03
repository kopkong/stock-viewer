/**
 * Created by colin on 2017/2/2.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'fixedPercent'})
export class FixedPercenterPipe implements PipeTransform {
  transform(value: number, digit: number): string {
    if (isNaN(value) || !(typeof digit === 'number' && digit % 1 === 0)) {
      return 'NaN';
    }

    if( value ) {
      return (value* 100).toFixed(digit) + '%';
    } else {
      return '0%';
    }
  }
}
