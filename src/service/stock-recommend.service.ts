import { BaseService } from './base.service';
import {Injector, Injectable} from "@angular/core";
import { Observable } from 'rxjs';

@Injectable()
export class StockRecommendService extends BaseService{

  // url = '/api/stockRecommend';

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  getStockRecommendByName(name: String) : Observable<any> {
    this.url = '/api/stockRecommend?name=' + name;
    return super.getData();
  }

  getStockRecommendList(pageIndex: Number) : Observable<any> {
    this.url = '/api/stockRecommend?pageSize=10&positive=1&notNew=1&pageIndex=' + pageIndex;

    return super.getData();
  }

}
