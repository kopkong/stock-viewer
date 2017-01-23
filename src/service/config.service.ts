/**
 * Created by colin on 2017/1/17.
 */

import { BaseService } from './base.service';
import { Injector, Injectable} from "@angular/core";

@Injectable()
export class ConfigService extends BaseService {
  url = '/api/config';

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

}
