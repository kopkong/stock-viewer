'use strict';

const path = require('path'),
    fs = require('fs'),
    readline = require('readline'),
    timers  = require('timers'),
    mongo_helper = require('./mongo_helper');

var propName = ['code','date','open','high','low','close','change','volume','money','traded_market_value','market_value' , 'turnover','adjust_price',
    'report_type','report_date','PE_TTM','PS_TTM','PC_TTM','PB','adjust_price_f'],
    indexPropName = ['index_code',	'date',	'open',	'close',	'low',	'high',	'volume',	'money',	'change'],
    stockDayArray = [],
    indexDayArray = [];

// 定义日线数据文件路径
const stockDataPath = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../proxy.conf.json'),'utf8')).csv.path,
    files = fs.readdirSync(path.resolve(stockDataPath,'stock data')),
    fileLength = files.length;

let cursor = 0;

function readStockCsv() {
    if(cursor >= fileLength){
        console.log('导入已完毕');
        return;
    }

    const file = files[cursor],
        filePath = path.resolve(stockDataPath,'stock data', file);

    stockDayArray = [];

    const content = fs.readFileSync(filePath, 'utf8').split('\n');

    for (let i = 1; i < content.length; i++) {
      let ary = content[i].split(','),
        obj = {};

      propName.forEach((v, index) => {
        obj[v] = ary[index];
      });

      // 将日期转成timestamp
      obj['date'] = new Date(obj['date']).getTime();

      if(obj.code) stockDayArray.push(obj);
    }

    saveStock({
      code: stockDayArray[0].code,
      dayArray: stockDayArray
    });

    cursor ++;
}

function readIndexCsv() {
  const indexFile = path.resolve(stockDataPath,'index data', 'sh000001.csv');
  const content = fs.readFileSync(indexFile, 'utf8').split('\n');

  for (let i = 1; i < content.length; i++) {
    let ary = content[i].split(','),
      obj = {};

    indexPropName.forEach((v, index) => {
      obj[v] = ary[index];
    });

    // 将日期转成timestamp
    obj['date'] = new Date(obj['date']).getTime();

    if(obj.date) indexDayArray.push(obj);
  }

  if (indexDayArray) {
    let name = indexDayArray[0].index_code;
    console.log('saving ', name);

    mongo_helper.deleteDocuments(name, {}, function() {
      mongo_helper.insertDocuments(name, indexDayArray);
    });
  }
}

function saveStock(stock) {
    console.log('saving ', stock.code);
    if (stock) {
        mongo_helper.deleteDocuments(stock.code, {}, function() {
          mongo_helper.insertDocuments(stock.code, stock.dayArray, readStockCsv);
        });
    }
}

function logImportData() {
  const today   = indexDayArray[0].date;
  const date    = new Date(today);
  const year    = date.getFullYear().toString();
  let month   = date.getMonth() + 1;
  let day     = date.getDate();

  if( month < 10 ) month = '0' + month;
  if( day < 10 ) day = '0' + day;

  let table_name = 'analysis_' + year + month + day;

  console.log('最近交易日为 ： ' + table_name);

  mongo_helper.insertDocuments('config', [{
      'import_date': today,
      'analysis_table': table_name,
      'operation_time' : new Date().getTime()
    }]
  );
}

readStockCsv();
readIndexCsv();
logImportData();




