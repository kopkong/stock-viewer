/**
 * Created by colin on 2017/1/3.
 */
const path = require('path'),
  fs = require('fs'),
  mongo_helper = require('./mongo_helper'),
  http = require('http');

const propName = ['code','name','industry'];

const stockDataPath = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../proxy.conf.json'),'utf8')).csv.path,
  files = fs.readdirSync(path.resolve(stockDataPath,'stock data')),
  fileLength = files.length;

let stats = new Map(),
  basicInfoMap = new Map(),
  statsArray = [],
  statsTradeDateArray  = [], // 统计日期，一般是一个月的月底。
  // tableName  = 'analysis',
  fileIndex  = 0;

function startAnalysis(){
  if(fileIndex < fileLength) {

    let name = files[fileIndex].replace('.csv','');
    mongo_helper.findDocuments(name, {data: -1})
      .then(value => {
        // analysisOneStock(fileIndex,value);
        analysisStockHistory(fileIndex, value);
        fileIndex++ ;
        startAnalysis();
      })
      .catch(error=> console.log(error));
  } else {
    finishAnalysis();
  }
}

function finishAnalysis(){
  console.timeEnd('分析已完毕!');
  mongo_helper.insertDocuments('historyTradeStatsDate', [
    {
      import_date: new Date().getTime(),
      trade_dates: statsTradeDateArray
    }
  ]);

  for(let record of stats) {
    let tableName = 'history' + record[0];
    mongo_helper.deleteDocuments(tableName, {}, function() {
      mongo_helper.insertDocuments(tableName, record[1]);
    });
  }
}

function analysisOneStock(index,doc) {
  console.log('分析中: ' + (index + 1) + ' / ' + fileLength);

  let maxPE = 0,
    minPE = Infinity,
    totalPE = 0,
    validSamples = 0;

  const firstDay = doc[doc.length - 1];
  const lastDay  = doc[0];
  const lastDate = new Date(lastDay.date);
  const newThree = firstDay.code.startsWith('sz300');

  if(!newThree && lastDate.getFullYear() === 2017) {
    doc.forEach(d => {
      if (d.PE_TTM) {
        if (d.PE_TTM > maxPE) maxPE = Number(d.PE_TTM);

        if (d.PE_TTM < minPE) minPE = Number(d.PE_TTM);

        totalPE += Number(d.PE_TTM);

        validSamples ++ ;
      }
    });

    const years = (lastDay.date - firstDay.date) / ( 365 * 24 * 3600 * 1000 );
    const expand_ratio = years > 1 ? Math.pow((lastDay.adjust_price / firstDay.adjust_price) , 1 / years ) - 1
      : 0;
    const basicInfo = basicInfoMap.get(firstDay.code);

    const stat = {
      'code':   firstDay.code,
      'max_PE': maxPE,
      'min_PE': minPE,
      'avg_PE': totalPE / validSamples,
      'last_PE': Number(lastDay.PE_TTM),
      'first_date': firstDay.date,
      'last_date' : lastDay.date,
      'first_price': Number(firstDay.adjust_price),
      'last_price': Number(lastDay.adjust_price),
      'last_close': Number(lastDay.close),
      'last_pe_ratio': (lastDay.PE_TTM ) / minPE,
      'years' : years,
      'expand_ratio' : expand_ratio,
      'name' : basicInfo && basicInfo.name,
      'industry': basicInfo&& basicInfo.industry,
      'traded_market_value': lastDay.traded_market_value
    };

    // make sure data is valid
    if(typeof stat.last_PE === 'number' && typeof stat.min_PE === 'number'){
      statsArray.push(stat);
    }
  }

}

function analysisStockHistory(index, doc) {
  if(doc.length <= 0) return;

  if(doc[0].code.startsWith('sz300')) return;

  console.log(doc[0].code + '分析中: ' + (index + 1) + ' / ' + fileLength);

  for(let idx = 1; idx < statsTradeDateArray.length; idx++){
    let tradeStatDate = statsTradeDateArray[idx],    // 统计日期，一般是一个月的月底。
      tradeCompareDate = statsTradeDateArray[idx-1], // 对比日期，一般是统计日期下一个月的月底。
      maxPE = 0,
      validSamples = 0,
      minPE = Infinity,
      totalPE = 0,
      allSamples = [];

    let compareDay = filterHistorySamples(doc, tradeStatDate, tradeCompareDate, allSamples);
    if(allSamples.length === 0) continue;

    const firstDay = allSamples[allSamples.length - 1];
    const lastDay  = allSamples[0];
    // console.log('lastDay is : ' + new Date(lastDay.date));
    // console.log('allSamples count : ' + allSamples.length);

    if(tradeStatDate - lastDay.date > 30* 24 * 3600 * 1000 ) {
      // console.log('数据太老，放弃继续处理。');
      continue;
    }

    allSamples.forEach(d => {
      if (d.PE_TTM) {
        if (d.PE_TTM > maxPE) maxPE = Number(d.PE_TTM);

        if (d.PE_TTM < minPE) minPE = Number(d.PE_TTM);

        totalPE += Number(d.PE_TTM);

        validSamples ++ ;
      }
    });

    const years = (lastDay.date - firstDay.date) / ( 365 * 24 * 3600 * 1000 );
    const expand_ratio = years > 1 ? Math.pow((lastDay.adjust_price / firstDay.adjust_price) , 1 / years ) - 1
      : 0;
    const basicInfo = basicInfoMap.get(firstDay.code);

    const stat = {
      'code':   firstDay.code,
      'max_PE': maxPE,
      'min_PE': minPE,
      'avg_PE': totalPE / validSamples,
      'last_PE': Number(lastDay.PE_TTM),
      'first_date': firstDay.date,
      'last_date' : lastDay.date,
      'first_price': Number(firstDay.adjust_price),
      'last_price': Number(lastDay.adjust_price),
      'last_close': Number(lastDay.close),
      'compare_price' : compareDay && Number(compareDay.adjust_price),
      'last_pe_ratio': (lastDay.PE_TTM ) / minPE,
      'years' : years,
      'expand_ratio' : expand_ratio,
      'name' : basicInfo && basicInfo.name,
      'industry': basicInfo&& basicInfo.industry,
      'traded_market_value': lastDay.traded_market_value
    };

    // make sure data is valid
    if(typeof stat.last_PE === 'number' && typeof stat.min_PE === 'number'){
      stats.get(tradeStatDate).push(stat);
    }
  }
}

function filterHistorySamples(doc, tradeDate, compareDate, list) {
  let  compareDay = null;

  doc.forEach(item=> {
    if(item.date === compareDate){
      compareDay = item;
    }

    if(item.date < tradeDate) {
      list.push(item);
    }
  });

  return compareDay;
}

let getBasicInfo = new Promise((resolve, reject) => {
  let infoMap = new Map();

  const info_file = path.resolve(stockDataPath,'name_info.csv');
  const content = fs.readFileSync(info_file, 'utf8').split('\r\n');

  for (let i = 1; i < content.length; i++) {
    let ary = content[i].split(','),
      obj = {};

    if(ary && ary.length === 3) {
      propName.forEach((v, index) => {
        obj[v] = ary[index].toLowerCase();
      });

      infoMap.set(obj['code'], obj);
    }
  }

  if(infoMap.size > 0){
    resolve(infoMap);
  } else {
    reject('no data');
  }

});

// 获取最近的12个月的第一个和最后一个交易日
let getLastTradeDate = new Promise((resolve, reject)=>{
  let month = 0,
    array = [];

  mongo_helper.findDocuments('sh000001')
    .then(doc => {
      for(let i = 0; i< 365; i++){
        if(i=== 0) {
          array.push(doc[i].date);
          month = new Date(doc[i].date).getMonth();
        }else {
          if(new Date(doc[i].date).getMonth() !== month) {
            array.push(doc[i].date);

            month = new Date(doc[i].date).getMonth();
          }
        }
      }

      if(array.length > 1) {
        resolve(array);
      }else {
        reject('no data');
      }
    });
});

function doAnalysis(){
  let p = Promise.all([getBasicInfo,getLastTradeDate]);

  p.then(([val1, val2])=> {
    basicInfoMap = val1;
    statsTradeDateArray = val2;

    statsTradeDateArray.forEach(date => {
      stats.set(date, []);
    });

    console.time('分析已完毕!');
    startAnalysis();
  });

  // mongo_helper.findDocuments('config',{_id:-1})
  //   .then(doc => {
  //     tableName = doc[0].analysis_table;
  //
  //     // 开始计时
  //     console.time('分析已完毕!');
  //
  //     startAnalysis();
  //   });
}

doAnalysis();





