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

  let param = <any>{};

  if(name) {
    param.$or = [{name:{$eq: name}}, {code: {$eq: 'sh' + name}}, {code: {$eq: 'sz' + name}}];
  } else {
    // 基础查询参数
    // 最后一个交易日 PE为正且小于50
    // 最低PE为正
    param.last_pe_ratio = {$gt: 0};
    param.min_PE = { $gt: 0 };
    param.last_PE = { $gt: 0, $lt: 50 };

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
  }

  let query = helper.findDocuments({
    name: 'config',
    sort: {_id: -1}
  });

  query.then(function(configV){
    let table = configV[0].analysis_table;
    let query2 = helper.findDocuments({
      name: table,
      query: param,
      sort: { last_pe_ratio: 1 }
    });

    query2.then(function(value){
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
});

export { stockRecommendRouter }
