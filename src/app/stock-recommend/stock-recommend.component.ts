import { Component, OnInit } from '@angular/core';

import { StockRecommend } from '../../model/stock-recommend';
import { StockRecommendService } from '../../service/stock-recommend.service';
import { ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-stock-recommend',
  templateUrl: './stock-recommend.component.html',
  styleUrls: ['./stock-recommend.component.scss']
})

export class StockRecommendComponent implements OnInit {
  stockRecommends : StockRecommend[];
  recommendLength : number;
  updateDate      : string;

  constructor(private recService: StockRecommendService,
    private cfgService:  ConfigService){};

  ngOnInit() {
    this.recService.getData()
      .then(recommends => {
        this.stockRecommends = recommends.list;
        this.recommendLength = recommends.list.length;
      } );

    this.cfgService.getData()
      .then(config => {
        this.updateDate = config.import_date;
      })
  }

}
