import { Component, OnInit } from '@angular/core';

import { StockRecommend } from '../../model/stock-recommend';
import { StockRecommendService } from '../../service/stock-recommend.service';

@Component({
  selector: 'app-stock-recommend',
  templateUrl: './stock-recommend.component.html',
  styleUrls: ['./stock-recommend.component.scss']
})

export class StockRecommendComponent implements OnInit {
  stockRecommends : StockRecommend[];
  recommendLength : number;

  constructor(private recService: StockRecommendService){};

  ngOnInit() {
    this.recService.getStockRecommend()
      .then(recommends => {
        this.stockRecommends = recommends;
        this.recommendLength = recommends.length;
      } );
  }

}
