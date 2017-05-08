
import { BaseService } from 'base.service';
import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class StockAnalysisService extends BaseService {
  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  getAnalysisList() : Observable<any> {
    this.url = 'api/analysis/';
    return super.getData();
  }

  getAnalysis(date: number) : Observable<any> {
    this.url = 'api/analysis/' + date;
    return super.getData();
  }

}
