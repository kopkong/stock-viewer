/**
 * Created by colin on 2017/1/3.
 */
const path = require('path'),
  fs = require('fs'),
  mongo_helper = require('./mongo_helper'),
  http = require('http');

const propName = ['code','name','industry'];

const stockDataPath = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../proxy.conf.json'),'utf8')).csv.path,
  files = fs.readdirSync(stockDataPath),
  fileLength = files.length,
  statsArray = [],
  basicInfoMap = new Map();

let cursor = 0;
console.time('分析已完毕');

function loopStock() {
  if(cursor >= fileLength){
    console.timeEnd('分析已完毕');
    mongo_helper.deleteDocuments('pe_analysis', {}, function() {
      mongo_helper.insertDocuments('pe_analysis', statsArray);
    });

    return;
  }

  const name = files[cursor].replace('.csv','');
  mongo_helper.findDocuments(name, {date: -1 },analysisOneStock);
}

function analysisOneStock(doc) {
  let maxPE = 0,
    minPE = Infinity,
    totalPE = 0,
    validSamples = 0;

  doc.forEach(d => {
    if (d.PE_TTM) {
      if (d.PE_TTM > maxPE) maxPE = Number(d.PE_TTM);

      if (d.PE_TTM < minPE) minPE = Number(d.PE_TTM);

      totalPE += Number(d.PE_TTM);

      validSamples ++ ;
    }
  });

  const firstDay = doc[doc.length - 1];
  const lastDay  = doc[0];
  const lastDate = new Date(lastDay.date);
  const newThree = firstDay.code.startsWith('sz300');

  if(lastDate.getFullYear() === 2017 && !newThree) {
    const years = (lastDay.date - firstDay.date) / ( 365 * 24 * 3600 * 1000 );
    const expand_ratio = years > 1 ? Math.pow((lastDay.adjust_price / firstDay.adjust_price) , 1 / years ) - 1
      : 0;
    const basicInfo = basicInfoMap.get(firstDay.code);
    // const name = basicInfo && basicInfo.name;

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
      'last_pe_ratio': (lastDay.PE_TTM ) / minPE,
      'years' : years,
      'expand_ratio' : expand_ratio,
      'name' : basicInfo && basicInfo.name,
      'industry': basicInfo&& basicInfo.industry
    };

    // make sure data is valid
    if(typeof stat.last_PE === 'number' && typeof stat.min_PE === 'number'){
      statsArray.push(stat);
    }
  }

  cursor ++;
  console.log('分析中: ' + cursor + ' / ' + fileLength);
  loopStock();
}

function getBasicInfo() {
  const info_file = path.resolve(stockDataPath,'../name_info.csv');

  const content = fs.readFileSync(info_file, 'utf8').split('\r\n');

  for (let i = 1; i < content.length; i++) {
    let ary = content[i].split(','),
      obj = {};

    if(ary && ary.length === 3) {
      propName.forEach((v, index) => {
        obj[v] = ary[index].toLowerCase();
      });

      basicInfoMap.set(obj['code'], obj);
    }
  }
}

getBasicInfo();
loopStock();



