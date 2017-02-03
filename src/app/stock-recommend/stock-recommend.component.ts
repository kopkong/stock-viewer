import { Component, OnInit } from '@angular/core';

import { StockRecommend } from '../../model/stock-recommend';
import { StockRecommendService } from '../../service/stock-recommend.service';
import { ConfigService } from '../../service/config.service';

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
  searchString    : string;

  constructor(private recService: StockRecommendService,
    private cfgService:  ConfigService){};

  ngOnInit() {
    this.currentPageIndex = 1;

    this.loadRecommendData();

    this.cfgService.getData()
      .then(config => {
        this.updateDate = config.import_date;
      })
  }

  pageSelect(page: number) {
    this.currentPageIndex = page;

    this.loadRecommendData();
    // this.searchString = 'pageSize=10&pageIndex=' + this.currentPageIndex;
  }

  loadRecommendData() {
    this.searchString = 'pageSize=10&pageIndex=' + (this.currentPageIndex - 1);
    this.recService.getData(this.searchString)
      .then(recommends => {
        this.stockRecommends = recommends.list;
        this.recommendLength = Math.ceil(recommends.count / 10);

        console.log(this.stockRecommends);
      } );
  }

}
