/**
 * Created by colin on 2017/2/4.
 */
export class StockFilter {
  text    : string;
  checked : boolean;

  constructor(_text:string, _checked:boolean) {
    this.text = _text;
    this.checked = _checked;
  }
}
