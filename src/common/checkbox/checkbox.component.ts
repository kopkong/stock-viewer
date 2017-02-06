import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractValueAccessor, MakeProvider } from '../value/abstract.value.accessor';

@Component({
  selector: 'st-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [MakeProvider(CheckboxComponent)]
})
export class CheckboxComponent extends AbstractValueAccessor{

  @Input()
  inputWord: string = 'unchecked';

  changeStatus() {
    this.value = !this.value;
  }
}
