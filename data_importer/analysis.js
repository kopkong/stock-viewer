/**
 * Created by colin on 2017/1/3.
 */
const path = require('path'),
  fs = require('fs'),
  mongo_helper = require('./mongo_helper');

const stockDataPath = path.resolve(__dirname, '../raw_data/stock data'),
  files = fs.readdirSync(stockDataPath),
  fileLength = files.length,
  statsArray = [];

let cursor = 0;

function loopStock() {
  if(cursor >= fileLength){
    console.log('分析已完毕');
    mongo_helper.insertDocuments('0_pe_table', statsArray);
    return;
  }

  const name = files[cursor].replace('.csv','');
  mongo_helper.findDocuments(name, analysisOneStock);
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

  const firstDay = doc[doc.length - 2];
  const lastDay  = doc[0];

  if(lastDay.date.slice(0,4) === '2016') {
    const years = lastDay.date.slice(0,4) - firstDay.date.slice(0,4);
    const expand_ratio = Math.pow((lastDay.adjust_price / firstDay.adjust_price) , 1 / (years -1 ));

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
      'expand_ratio' : expand_ratio
    };

    // make sure data is valid
    if(typeof stat.last_PE === 'number' && typeof stat.min_PE === 'number'){
      statsArray.push(stat);
    }
  }

  cursor ++;
  loopStock();
}

loopStock();



