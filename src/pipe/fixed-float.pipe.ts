/**
 * Created by colin on 2017/1/5.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'fixedFloat'})
export class FixedFloatPipe implements PipeTransform {
  transform(value: number, digit: number): number {
    if (isNaN(value) || !(typeof digit === 'number' && digit % 1 === 0)) {
      return NaN;
    }

    if(typeof value === 'string'){
      value = parseFloat(value);
    }

    return +value.toFixed(digit);
  }
}
