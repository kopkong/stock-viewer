import { Injectable } from '@angular/core';
import { StockAnalysisService } from './stock-analysis.service';
import { Observable } from 'rxjs';

@Injectable()
export class DataCacheService {
  globalData : any = {
    analysisList: [],
    analysisMap: new Map(),
    currentRouteName: '',
  };

  constructor(private analysisService: StockAnalysisService) {
  }

  getAnalysisList(): Observable<any> {
    return Observable.create(observer => {
      try{
        if(this.globalData.analysisList.length > 0) {
          observer.next(this.globalData.analysisList);
        }else {
          this.analysisService.getAnalysisList()
            .subscribe(res => {
              if(res && res.list && res.list.length){
                this.globalData.analysisList = res.list;
                observer.next(res.list);
              }
            });
        }
      }catch(err) {
        observer.error(err);
      }
    });
  }

  getAnalysis(date): Observable<any> {
    return Observable.create(observer => {
      try{
        if(this.globalData.analysisMap.has(date)){
          observer.next(this.globalData.analysisMap.get(date));
        }else {
          this.analysisService.getAnalysis(date)
            .subscribe(res => {
              if(res && res.list){
                this.globalData.analysisMap.set(date, res);
                observer.next(res);
              }
            });
        }
      }catch(err){

      }
    });
  }
}
