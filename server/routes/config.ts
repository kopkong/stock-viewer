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
    sort: {_id: -1}
  });

  query.then(function(value){
    console.log(value);

    if(value && value.length > 0 ) {
      // let ary = value[0];
      let obj = value[0];

      // value.forEach(item => {
      //   if(item.name) obj[item.name] = item.value;
      // });

      response.json(obj);

    } else {
      response.json({
        message: '没有数据'
      })
    }
  });

});

export { configRouter }
