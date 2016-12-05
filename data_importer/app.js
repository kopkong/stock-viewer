const path = require('path'),
    fs = require('fs'),
    readline = require('readline'),
    timers  = require('timers'),
    mongo_helper = require('./mongo_helper');

var propName = ['code','date','open','high,low','close','change','volume','money','traded_market_value','market_value' , 'turnover','adjust_price',
    'report_type','report_date','PE_TTM,PS_TTM','PC_TTM','PB','adjust_price_f'],
    stockDayArray = [];

// 定义日线数据文件路径
const stockDataPath = path.resolve(__dirname, '../raw_data/stock data'),
    files = fs.readdirSync(stockDataPath),
    fileLength = files.length;

let cursor = 0;

function readStockCsv() {
    if(cursor >= fileLength){
        console.log('导入已完毕');
        return;
    }

    const file = files[cursor],
        filePath = path.resolve(stockDataPath, file);

    stockDayArray = [];

    const content = fs.readFileSync(filePath, 'utf8').split('\n');

    for (let i = 1; i < content.length; i++) {
        let ary = content[i].split(','),
            obj = {};

        propName.forEach((v, index) => {
            obj[v] = ary[index];
        });

        stockDayArray.push(obj);
    }

    saveStock({
        code: stockDayArray[0].code,
        dayArray: stockDayArray
    });

    cursor ++;
}

function saveStock(stock) {
    console.log('saving ', stock.code);
    if (stock) {
        mongo_helper.insertDocuments(stock.code, stock.dayArray, readStockCsv);
    }
}

readStockCsv();




