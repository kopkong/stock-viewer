# 股价分析小工具

这个工具只是给自己买股票的时候提供价格参考的，低价指数较低的股票表示现在比较便宜可以考虑购买。

## 项目使用技术和框架

*   Server:     NodeJs + Express
*   Client:     Angular2

## 目录结构

*   data_importer/
    *       导入数据和分析数据用的js脚本
*   server/
    *       服务端接口代码
*   src/
    *   客户端代码


## 项目配置文件proxy.conf.json需要放在项目根目录下
```javascript
{
    "/api": {
        "target": "http://localhost:4301",
        "secure": false
    },
    "mongo": {
      "url" : "mongodb://localhost:27017/stock"
    },
    "csv": {
      "zip" : "/Users/colin/Downloads/trading-data@full.20170210.zip",
      "path": "/Users/colin/WebstormProjects/Stock/raw_data"
    }
}
```

## 打包

`npm run build` 。 打包文件将保存到根目录下的`/dist`。

## 发布以及部署

*   需要先安装配置PM2 http://pm2.keymetrics.io/
*   `npm run deploy` 发布并启动远程项目.

## 准备数据

*   先用FTP上传zip数据包到服务器目录。数据包路径应与配置中csv.zip 一致。zip数据包获取网站 http://www.yucezhe.com.
*   登录到远程服务器之后运行 `./data_importer/bat.sh`
