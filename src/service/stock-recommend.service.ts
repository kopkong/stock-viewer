import { BaseService } from './base.service';
import {Injector, Injectable} from "@angular/core";

@Injectable()
export class StockRecommendService extends BaseService{

  url = '/api/stockRecommend';

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

}
