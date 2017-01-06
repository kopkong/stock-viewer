/**
 * Created by colin on 2017/1/4.
 */
import { Router, Response, Request } from 'express';
import  MongoHelper  from '../mongo/helper';

const stockRecommendRouter: Router = Router();
const helper : MongoHelper = new MongoHelper();

stockRecommendRouter.get('',  (request: Request, response: Response) => {
  const pageIndex : any = request.query.pageIndex || 0;
  const pageSize  : any = request.query.pageSize  || 10;
  const start : Number = pageIndex * pageSize;
  const end   : Number = ( pageIndex + 1) * pageSize;

  let query = helper.findDocuments('0_pe_table',
    { last_pe_ratio: { $gt: 0 }, min_PE: { $gt: 0 }, last_PE: { $gt: 0, $lt: 50 }},
    { last_pe_ratio: 1 });

  query.then(function(value){
    let ary = value;

    // // 默认是从低到高倒序排列的
    // if(order === 'asc') {
    //   ary = ary.reverse();
    // }

    if(ary && ary.length > 0 ) {
      response.json({
        count: ary.length,
        list: ary.slice(start,end)
      })
    } else {
      response.json({
        message: '没有数据'
      })
    }
  });

});

export { stockRecommendRouter }
