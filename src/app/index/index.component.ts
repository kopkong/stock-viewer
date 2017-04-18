import { Component , Input, OnChanges } from '@angular/core';
import { StockDayService } from '../../service/stock-day.service';
import { StockCurrentService } from '../../service/stock-current.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'stock-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnChanges {
  private _indexCode = 'sh000001';
  private _startDate : number;

  // 指数起始日期
  @Input()
  set startDate(date: number) {
    this._startDate = date;
  }

  get startDate() : number {
    return this._startDate;
  }

  currentIndex  : number = 0;   // 当前指数
  startIndex    : number = 0; // 起始日期的指数
  changeRate    : number = 0; // 变化率

  constructor(private dayService: StockDayService,
    private curService: StockCurrentService
  ) { }

  ngOnChanges() {
    if(this._startDate){
      let observable1 = this.dayService.getStockList(this._indexCode, this._startDate),
        observable2 = this.curService.getCurrentStockData(this._indexCode);

      let result = Observable.forkJoin(observable1, observable2);

      result.subscribe(response => {
        this.startIndex = response[0].list[0].close;
        this.currentIndex = response[1].list[0].split(',')[3];
        this.changeRate = ((this.currentIndex - this.startIndex) * 100 / this.startIndex);
      })
    }
  }

}
