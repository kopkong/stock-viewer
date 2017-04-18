/**
 * Created by colin on 2017/4/18.
 */

import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Injectable ,Injector} from "@angular/core";

@Injectable()
export class StockDayService extends BaseService {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  getStockList(code:String, date : Number) : Observable<any> {
    this.url = '/api/stock/'+ code +'?dateStart='+ date + '&dateEnd=' + date;
    return super.getData();
  }


}

