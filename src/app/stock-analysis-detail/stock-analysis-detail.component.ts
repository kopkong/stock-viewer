import { Component, OnInit } from '@angular/core';
import { DataCacheService } from '../../service/cache';
import { Router, ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-stock-analysis-detail',
  templateUrl: './stock-analysis-detail.component.html',
  styleUrls: ['./stock-analysis-detail.component.scss']
})
export class StockAnalysisDetailComponent implements OnInit {
  analysisData: any = {};

  constructor(private cacheService:DataCacheService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.cacheService.getAnalysis(+params['id']))
      .subscribe(value=>{
        this.analysisData = value;

        // 计算变化情况
        this.analysisData.list.forEach((item,index,list) => {
          list[index].changeRate = (item.compare_price - item.last_price) / item.last_price ;
        });
        console.log(value);
      });

  }

}
