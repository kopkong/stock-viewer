/**
 * Created by colin on 2017/1/17.
 */
import { Router, Response, Request } from 'express';
import  MongoHelper  from '../mongo/helper';

const configRouter: Router = Router();
const helper : MongoHelper = new MongoHelper();


configRouter.get('',  (request: Request, response: Response) => {

  let query = helper.findDocuments({
    name: 'config',
    query: {name: 'import_date'}
  });

  query.then(function(value){

    if(value && value.length > 0 ) {
      let obj = {};

      value.forEach(item => {
        if(item.name) obj[item.name] = item.value;
      });

      response.json(obj);

    } else {
      response.json({
        message: '没有数据'
      })
    }
  });

});

export { configRouter }