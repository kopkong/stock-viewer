// 这个脚本运行会有问题，暂时废弃不用了。

const mongo_helper = require('./mongo_helper');

let goodStatsCount = 0,
  goodIndexCount = 0,
  allStatsCount = 0,
  goodStatStandard = 50;

// 获取分析结果table
let getHistoryStatsTable = new Promise((resolve, reject) => {
  mongo_helper.findDocuments('historyTradeStatsDate', {}, {_id: -1})
    .then(value => {
      if (value) {
        // pass the first one
        resolve(value[0].trade_dates);
      } else {
        reject('no data');
      }
    })
});

function getIndexPoint(date) {
  return new Promise((resolve, reject) => {
    mongo_helper.findDocuments('sh000001', {date: {$eq: Number(date)}})
      .then(value => {
        // console.log(value);
        resolve(value[0].close);
      })
  });
}

function getTableDates(statDate) {
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
  return mongo_helper.findDocuments(tableName, query, sort);
}

function genAnalysisStats(statDate) {
  return new Promise((resolve,reject) => {
    getTableDates(statDate)
      .then(doc => {
        let total = doc.length,
          good = 0,
          bad = 0,
          growth = 0;

        doc.slice(0,10).forEach(item => {
          growth += ((item.compare_price - item.last_price) / item.last_price) ;
          // if (item.last_price < item.compare_price) good++;
          // if (item.last_price > item.compare_price) bad++;
        });

        Promise.all([getIndexPoint(statDate), getIndexPoint(compareDate)])
          .then(([val1, val2]) => {

            let indexRate = (100 * (val2 - val1) / val1).toFixed(2),
              goodRate = (100 * good / total).toFixed(2),
              avgRate = (100 * growth / 10).toFixed(2);

            // if (goodRate > goodStatStandard) goodStatsCount++;

            if (val2 > val1) goodIndexCount++;
            const timeString = new Date(statDate).toLocaleDateString() + ' ～ '
              + new Date(compareDate).toLocaleDateString();

            console.log('周期：'+ timeString +' 大盘：' + indexRate + '% 样本平均值：' + avgRate + '%' );

            resolve(avgRate > indexRate);
          });
      })
  });
}

function start() {
  getHistoryStatsTable.then(value => {
    // 总数
    allStatsCount = value.length - 1;

    let promiseList = [];
    for (let idx = 0; idx < value.length; idx++) {
      let statDate = value[idx];

      promiseList.push(genAnalysisStats(statDate));
    }

    Promise.all(promiseList)
      .then(value => {
        value.forEach(item=>{

          if(item) goodStatsCount ++;
        });

        console.log('结果：' + goodStatsCount + '／' + allStatsCount);
      })
  });
}

start();
