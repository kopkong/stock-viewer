/**
 * Created by colin on 2017/1/22.
 */

import { Injectable, Injector} from '@angular/core';
import { Response, Http, Request, RequestMethod } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BaseService {
  http: Http;
  protected url = '';

  constructor(injector: Injector) {
    this.http = injector.get(Http);
  }

  getData(search?: string) : Promise<any>{
    return this.http.request(new Request({
      method: RequestMethod.Get,
      url: this.url,
      search: search
    }))
      .toPromise()
      .then(response => {
        return response.json();
      })
      .catch(this.handleError);
  };

  handleError(error: any) : Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
