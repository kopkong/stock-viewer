const execSync = require('child_process').execSync,
  path = require('path'),
  fs = require('fs'),
  util = require('util');

const extractPath = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../proxy.conf.json'),'utf8')).csv.path,
  filePath = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../proxy.conf.json'),'utf8')).csv.zip,
  files = fs.readdirSync(filePath);

let zip = files.filter(item => {return item.indexOf('.zip') !== -1} );

if(zip.length) {
  console.log('开始解压');
  const cmd = util.format('sudo unzip -o %s -d %s', path.resolve(filePath,zip[0]), extractPath);
  execSync(cmd);
  console.log('解压完毕');
} else {
  console.log('没有找到压缩文件！');
  return;
}


