/**
 * Created by colin on 2017/1/22.
 */

import { Injectable, Injector} from '@angular/core';
import { Response, Http, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// import 'rxjs/add/operator/toPromise';

@Injectable()
export class BaseService {
  http: Http;
  protected baseUrl = environment.production? '' : 'http://localhost:4301';
  protected url = '';
  protected appKey = '123';

  constructor(injector: Injector) {
    this.http = injector.get(Http);
  }

  getData() : Observable<any>{
    return this.http.request(new Request({
      method: RequestMethod.Get,
      url: this.baseUrl + this.url
    }))
      .map(response =>{
        return response.json();
      }).catch(this.handleError);
  };

  handleError(error: any) {
    console.error('An error occurred', error); // for demo purposes only

    return Observable.throw('error code 1');
  }
}
