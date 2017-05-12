import {Component, OnInit} from '@angular/core';
import {DataCacheService} from '../../service/cache';

@Component({
  selector: 'stock-analysis',
  templateUrl: './stock-analysis.component.html',
  styleUrls: ['./stock-analysis.component.scss']
})

export class StockAnalysisComponent implements OnInit {
  analysisList: any[] = [];
  analysisMap = new Map();
  winCount = 0;

  constructor(private cacheService: DataCacheService) {
  }

  ngOnInit() {
    this.cacheService.getAnalysisList()
      .subscribe(res => {
        this.analysisList = res;
        res.forEach(date => {
          this.cacheService.getAnalysis(date)
            .subscribe(value => {

              this.analysisMap.set(date, value);

              if(value.averageRate > value.indexRate){
                this.winCount ++;
              }
            });
        })
      })
  }

}
