import { Component, OnInit } from '@angular/core';

import { StockRecommend } from '../../model/stock-recommend';
import { StockRecommendService } from '../../service/stock-recommend.service';
import { ConfigService } from '../../service/config.service';
import { StockCurrentService } from '../../service/stock-current.service';
import { StockFilter } from '../../model/filter';

@Component({
  selector: 'stock-recommend',
  templateUrl: './stock-recommend.component.html',
  styleUrls: ['./stock-recommend.component.scss']
})

export class StockRecommendComponent implements OnInit {
  stockRecommends : StockRecommend[];
  stockCurrents   : any[] = [];
  recommendLength : number;
  updateDate      : string;
  currentPageIndex: number;
  searchName      : string;

  headers = ['名字','行业','统计时价','低价指数','当前价','推荐价','当前低价指数'];
  // filters = [
  //   new StockFilter('增长率为正的', true) ,
  //   new StockFilter('上市满一年的', true) ,
  //   new StockFilter('没有停牌', true)
  // ];

  constructor(private recService: StockRecommendService,
    private cfgService: ConfigService,
    private curService: StockCurrentService
  ){};

  ngOnInit() {
    this.currentPageIndex = 1;

    this.cfgService.getData()
      .then(config => {
        this.updateDate = config.import_date;

        this.loadRecommendData();
      })
  }

  loadRecommendData() {
    // let searchString = 'pageSize=10&positive='+ (this.filters[0].checked? '1' : '0')
    //   + '&pageIndex=' + (this.currentPageIndex - 1)
    //   + '&notNew=' + (this.filters[1].checked? '1' : '0');

    // if(this.filters[2].checked) {
    //   searchString += '&lastDate=' + this.updateDate;
    // }

    let searchString = 'pageSize=10&positive=1&notNew=1&pageIndex=' + (this.currentPageIndex - 1);

    if(this.searchName) {
      searchString += '&name=' + this.searchName;
    }

    this.recService.getData(searchString)
      .then(recommends => {
        if(recommends) {
          this.stockRecommends = recommends.list;
          this.recommendLength = Math.ceil(recommends.count / 10);

          this.loadCurrentData();
        }
      } );
  }

  loadCurrentData() {
    if(this.stockRecommends) {
      let codes = this.stockRecommends.map(item => {
        return item.code;
      }).toString();

      console.log(codes);

      this.curService.getCurrentStockData(codes)
        .then(res => {
          console.log(res.list.length);
          this.stockCurrents = res.list.map((item,index) => {
            let array = item.split(',');
            let recommend = this.stockRecommends[index];
            return {
              name: array[0],
              price: array[3],
              time: array[30] + ' ' + array[31],
              pe_ratio: (array[3] * recommend.last_PE) / (recommend.last_close * recommend.min_PE)
            }
          });
        })
    }
  }

  onEnter(value:string) {
    this.searchName = value;
    this.loadRecommendData();
  }

  pageSelect(page: number) {
    this.currentPageIndex = page;

    this.loadRecommendData();
  }

  getClass(stockRec: any, i: number): any {
    if (!this.stockCurrents[i]) { return null; }

    return {
      'lower': this.stockCurrents[i].pe_ratio < stockRec.last_pe_ratio,
      'higher': this.stockCurrents[i].pe_ratio > stockRec.last_pe_ratio
    };
  }
}
