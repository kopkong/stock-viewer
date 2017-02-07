import { Component, OnInit } from '@angular/core';

import { StockRecommend } from '../../model/stock-recommend';
import { StockRecommendService } from '../../service/stock-recommend.service';
import { ConfigService } from '../../service/config.service';
import { StockFilter } from '../../model/filter';

@Component({
  selector: 'stock-recommend',
  templateUrl: './stock-recommend.component.html',
  styleUrls: ['./stock-recommend.component.scss']
})

export class StockRecommendComponent implements OnInit {
  stockRecommends : StockRecommend[];
  recommendLength : number;
  updateDate      : string;
  currentPageIndex: number;

  headers = ['代码','名字','上市年数','年均增长率','最近交易日','最近收盘价','最近PE / 历史最低PE','行业'];
  filters = [
    new StockFilter('增长率为正的', true) ,
    new StockFilter('上市满一年的', true) ,
    new StockFilter('没有停牌', true)
  ];

  constructor(private recService: StockRecommendService,
    private cfgService:  ConfigService){};

  ngOnInit() {
    this.currentPageIndex = 1;

    this.cfgService.getData()
      .then(config => {
        this.updateDate = config.import_date;

        this.loadRecommendData();
      })
  }

  pageSelect(page: number) {
    this.currentPageIndex = page;

    this.loadRecommendData();
  }

  filterChange() {
    console.log('filterChange');
    this.loadRecommendData();
  }

  loadRecommendData() {
    let searchString = 'pageSize=10&positive='+ (this.filters[0].checked? '1' : '0')
      + '&pageIndex=' + (this.currentPageIndex - 1)
      + '&notNew=' + (this.filters[1].checked? '1' : '0');

    if(this.filters[2].checked) {
      searchString += '&lastDate=' + this.updateDate;
    }

    console.log(searchString);

    this.recService.getData(searchString)
      .then(recommends => {
        if(recommends) {
          this.stockRecommends = recommends.list;
          this.recommendLength = Math.ceil(recommends.count / 10);
        }
        console.log(this.stockRecommends);
      } );
  }

}
