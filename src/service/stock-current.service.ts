/**
 * Created by colin on 2017/2/7.
 */
import { BaseService } from './base.service';
import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class StockCurrentService extends BaseService {

  // url = '/api/stockCurrent/';

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  getCurrentStockData(code: string) : Observable<any> {
    this.url = '/api/stockCurrent/' + code;
    return super.getData();
  }

}
