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
  const lastDate  : number = Number(request.query.lastDate);  // 最近交易日
  const notNew    : number = Number(request.query.notNew) ;   // 不是次新股
  const positive  : number = Number(request.query.positive) ; // 增长率是正的
  const name      : string = request.query.name;      // 输入了名称
  const start     : number = pageIndex * pageSize;
  const end       : number = ( pageIndex + 1) * pageSize;

  var param = <any>{
    last_pe_ratio: { $gt: 0 },
    min_PE: { $gt: 0 },
    last_PE: { $gt: 0, $lt: 50 },
    // last_date: {},
    // years: {},
    // expand_ratio: {}
  };

  // 拼装查询参数
  if(lastDate) {
    param.last_date = {$eq: lastDate }
  }

  if(notNew) {
    param.years = {$gt: 1}
  }

  if(positive) {
    param.expand_ratio = {$gt: 0}
  }

  if(name) {
    param.name = {$eq: name}
  }

  console.log(param);

  let query = helper.findDocuments({
      name:'pe_analysis',
      query: param,
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
