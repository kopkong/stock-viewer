# 股价分析小工具

这个工具只是给自己买股票的时候提供价格参考的，低价指数较低的股票表示现在比较便宜可以考虑购买。

## 项目使用技术和框架

*   Server:     Angular2
*   Client:     NodeJs + Express

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

`npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Deploy

*   需要先安装配置PM2
*   `npm run deploy` to deploy the project.

## 准备数据

*   先用FTP上传zip数据包到服务器目录。数据包路径应与配置中csv.zip 一致。
*   登录到远程服务器之后运行 `./data_importer/bat.sh`
