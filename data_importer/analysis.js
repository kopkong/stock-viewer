/**
 * Created by colin on 2017/1/3.
 */
const path = require('path'),
  fs = require('fs'),
  mongo_helper = require('./mongo_helper'),
  http = require('http');

const propName = ['code','name','industry'];

const stockDataPath = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../proxy.conf.json'),'utf8')).csv.path,
  files = fs.readdirSync(path.resolve(stockDataPath,'stock data'))
    .filter(item=> {
      return !item.startsWith('sz300'); // 不需要300 创业版的数据
    }),
  fileLength = files.length;

let stats = new Map(),
  basicInfoMap = new Map(),
  statsArray = [],
  statsTradeDateArray  = [], // 统计日期，一般是一个月的月底。
  fileIndex  = 0;

function startAnalysis(){
  if(fileIndex < fileLength) {

    let name = files[fileIndex].replace('.csv','');
    mongo_helper.findDocuments(name,{}, {date: -1})
      .then(value => {
        analysisStock(fileIndex, value);
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
      import_dayString: new Date().toLocaleDateString(),
      trade_dates: statsTradeDateArray.slice(1, statsTradeDateArray.length -1)
    }
  ]);

  mongo_helper.findDocuments('config',{},{_id:-1})
    .then(doc => {
      if(doc&& doc.length) {
        let tableName = doc[0].analysis_table;

        mongo_helper.deleteDocuments(tableName, {}, function() {
          mongo_helper.insertDocuments(tableName, statsArray);
        });
      }else {
        console.log('Config not found!');
      }
    });

  for(let record of stats) {
    let tableName = 'history' + record[0];
    mongo_helper.deleteDocuments(tableName, {}, function() {
      mongo_helper.insertDocuments(tableName, record[1]);
    });
  }
}

function analysisStock(index, doc) {
  if(doc.length <= 0) return;

  console.log(doc[0].code + '分析中: ' + (index + 1) + ' / ' + fileLength);

  for(let idx = 0; idx < statsTradeDateArray.length; idx++){
    if(idx ===0){
      dealCurrent(doc);
    }else{
      dealHistory(doc, statsTradeDateArray[idx], statsTradeDateArray[idx - 1]);
    }
  }
}

// 处理分析历史数据，非当前
// tradeStatDate 统计日期，一般是一个月的月底。
// tradeCompareDate 对比日期，一般是统计日期下一个月的月底。
function dealHistory(doc, tradeStatDate, tradeCompareDate) {
  let maxPE = 0,
    validSamples = 0,
    minPE = Infinity,
    totalPE = 0,
    allSamples = [];

  let compareDay = filterHistorySamples(doc, tradeStatDate, tradeCompareDate, allSamples);
  if(allSamples.length === 0) return;

  const firstDay = allSamples[allSamples.length - 1];
  const lastDay  = allSamples[0];

  if(tradeStatDate - lastDay.date > 30* 24 * 3600 * 1000 ) {
    // console.log('数据太老，放弃继续处理。');
    return;
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
    'compare_close' : compareDay && Number(compareDay.close),
    'compare_date' : compareDay && Number(compareDay.date),
    'last_pe_ratio': (lastDay.PE_TTM ) / minPE,
    'years' : years,
    'expand_ratio' : expand_ratio,
    'name' : basicInfo && basicInfo.name,
    'industry': basicInfo&& basicInfo.industry,
    'traded_market_value': Number(lastDay.traded_market_value)
  };

  // make sure data is valid
  if(typeof stat.last_PE === 'number' && typeof stat.min_PE === 'number'){
    stats.get(tradeStatDate).push(stat);
  }
}

// 处理分析最新数据，统计到最新
function dealCurrent(doc){
  let
    maxPE = 0,
    validSamples = 0,
    minPE = Infinity,
    totalPE = 0,
    allSamples = doc;

  const firstDay = allSamples[allSamples.length - 1];
  const lastDay  = allSamples[0];

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
    'last_pe_ratio': (lastDay.PE_TTM ) / minPE,
    'years' : years,
    'expand_ratio' : expand_ratio,
    'name' : basicInfo && basicInfo.name,
    'industry': basicInfo&& basicInfo.industry,
    'traded_market_value': Number(lastDay.traded_market_value)
  };

  // make sure data is valid
  if(typeof stat.last_PE === 'number' && typeof stat.min_PE === 'number'){
    statsArray.push(stat);
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

  mongo_helper.findDocuments('sh000001',{},{date:-1})
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
}

doAnalysis();





