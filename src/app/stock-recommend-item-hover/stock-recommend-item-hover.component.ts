import { Component, Input, OnChanges } from '@angular/core';
import { StockRecommend } from '../../model/stock-recommend';


@Component({
  selector: 'app-stock-recommend-item-hover',
  templateUrl: './stock-recommend-item-hover.component.html',
  styleUrls: ['./stock-recommend-item-hover.component.scss']
})
export class StockRecommendItemHoverComponent implements OnChanges {
  positionExp: any = {};
  constructor() { }

  @Input()
  item: StockRecommend = null;

  @Input()
  point: any = {};

  ngOnChanges() {
    this.positionExp = {
      'top': this.point.x + 'px',
      'left': this.point.y + 'px'
    }

  }

}
