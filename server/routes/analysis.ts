/**
 * Created by colin on 2017/5/5.
 */
/**
 * Created by colin on 2017/5/5.
 * 历史分析的结果查询
 */
import {Router, Response, Request} from 'express';
import  MongoHelper  from '../mongo/helper';

const analysisRouter: Router = Router();
const helper: MongoHelper = new MongoHelper();

analysisRouter.get('',  (request: Request, response: Response) => {
  getAnalysisDates()
    .then(value=> {
      if(value){
        response.json({
          list: value[0].trade_dates
        });
      }else {
        response.json({
          message: 'no data'
        });
      }
    })
});

analysisRouter.get('/:statDate', (request: Request, response: Response) => {
  const statDate = request.params.statDate;

  if(statDate){
    getAnalysisData(statDate)
      .then(value=> {
        if(value && value.length > 10) {
          let top10 = [],
            changeRate = 0;

          // top10.forEach(sample => {
          for(let i = 0; i < value.length; i++) {
            let sample = value[i];
            if (sample.compare_price) {
              changeRate += (sample.compare_price - sample.last_price) / sample.last_price;
              top10.push(sample);

              if (top10.length === 10) {
                break;
              }
            }
          }

          // 计算平均涨幅
          let avgRate = changeRate / 10,
            tradeDate = top10[0].last_date,
            compareDate = top10[0].compare_date;

          Promise.all([getIndexPoint(tradeDate), getIndexPoint(compareDate)])
            .then(([val1,val2])=> {
              let startIndex = Number(val1),
                endIndex = Number(val2);

              let indexChangeRate = (endIndex - startIndex) / startIndex;
              response.json({
                averageRate: avgRate,
                indexRate : indexChangeRate,
                list: top10
              });
          });

        }else {
          response.json({
            message: 'no data'
          });
        }

      });
  }else {
    console.log('Should not go here!');
  }
});

// 获取指定交易日的统计信息
function getAnalysisData(statDate) {
  const query = {
    last_pe_ratio: {$gt: 0},
    min_PE: {$gt: 0},
    last_PE: {$gt: 0, $lt: 50},
    years: {$gt: 1},
    expand_ratio: {$gt: .1}
    // traded_market_value : {$gt:1000000000}
  };

  const sort = {last_pe_ratio: 1};
  const tableName = 'history' + statDate;

  return helper.findDocuments({
    name: tableName,
    query: query,
    sort: sort
  });
}

// 获取所有统计日的信息
function getAnalysisDates() {
  return helper.findDocuments({
    name: 'historyTradeStatsDate',
    sort: {'_id': -1}
  })
}

function getIndexPoint(date) {
  return new Promise((resolve, reject) => {
    helper.findDocuments({
      name: 'sh000001',
      query: {date: {$eq: Number(date)}}
    })
      .then(value => {
        resolve(value[0].close);
      })
  });
}

export {analysisRouter};
