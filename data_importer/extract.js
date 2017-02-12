const execSync = require('child_process').execSync,
  path = require('path'),
  fs = require('fs'),
  util = require('util');

const extractPath = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../proxy.conf.json'),'utf8')).csv.path,
  filePath = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../proxy.conf.json'),'utf8')).csv.zip;

console.log('开始解压');
const cmd = util.format('sudo unzip -o %s -d %s', filePath, extractPath);
execSync(cmd);
console.log('解压完毕');

// execSync(util.format('node %s/import.js', __dirname));
//
// execSync(util.format('node %s/analysis.js', __dirname));
