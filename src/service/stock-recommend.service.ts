import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { StockRecommend } from '../model/stock-recommend';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class StockRecommendService {
  private url = '//www.whaleplayer.com/api/stockRecommend';

  constructor(private http: Http) { }

  getStockRecommend() : Promise<StockRecommend[]>{
    return this.http.get(this.url)
      .toPromise()
      .then(response => {
        return response.json().list as StockRecommend[];
      })
      .catch(this.handleError);
  };

  private handleError(error: any) : Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
