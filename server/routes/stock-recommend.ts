/**
 * Created by colin on 2017/1/4.
 */
import { Router, Response, Request } from 'express';
import  MongoHelper  from '../mongo/helper';

const stockRecommendRouter: Router = Router();
const helper : MongoHelper = new MongoHelper();

stockRecommendRouter.get('',  (request: Request, response: Response) => {
  const pageIndex : number = Number(request.query.pageIndex) || 0;
  const pageSize  : number = Number(request.query.pageSize)  || 10;
  const start : number = pageIndex * pageSize;
  const end   : number = ( pageIndex + 1) * pageSize;


  let query = helper.findDocuments({
      name:'0_pe_table',
      query: { last_pe_ratio: { $gt: 0 }, min_PE: { $gt: 0 }, last_PE: { $gt: 0, $lt: 50 }},
      sort: { last_pe_ratio: 1 }
    });

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
