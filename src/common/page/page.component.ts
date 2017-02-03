import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  private _maxPageWidth = 10;
  private _total        = 1;
  private _index        = 1;
  private _screen       = 1;

  @Input()
  set pageTotal(pageTotal: number) {
    this._total = pageTotal > 0 ? pageTotal : 1;
  }

  get pageTotal() : number {
    return this._total;
  }

  @Input()
  set pageIndex(pageIndex : number) {
    this._index = pageIndex > 0 ? pageIndex : 1;
  }

  get pageIndex() : number {
    return this._index;
  }

  get currentPages() : number[] {
    let min = (this._screen - 1) * this._maxPageWidth + 1,
      max = this._screen * this._maxPageWidth,
      ary = [];

    max = max > this._total ? this._total : max;

    for(let i = min; i<= max; i++ ) {
      ary.push(i);
    }

    return ary;
  }

  @Output() onPageSelect = new EventEmitter<number>();

  selectPage(page: number) {
    this.onPageSelect.emit(page);
    this._index = page;
  }

}
