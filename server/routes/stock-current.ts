/**
 * Created by colin on 2017/2/7.
 */
import { Router, Response, Request } from 'express';
import * as http from "http";
import * as iconv from 'iconv-lite';

const stockCurrentRouter:Router = Router();

stockCurrentRouter.get('/:ids', (request: Request, response: Response) => {
  const ids = request.params.ids;
  const list = ids.split(',');

  if(list.length > 0) {
    const options = {
      host: 'hq.sinajs.cn',
      path: '/list=' + ids
    };

    // console.log(options);

    let req = http.get(options, function(res) {
      // console.log('STATUS: ' + res.statusCode);
      // console.log('HEADERS: ' + JSON.stringify(res.headers));

      let bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        let body = Buffer.concat(bodyChunks),
          resultStr = iconv.decode(body,'gbk'),
          ary = [];

        let pattern = /"[^"]+"/g,
          groups = resultStr.match(pattern);

        // console.log(resultStr);

        if(groups) {
          groups.forEach(g=> {
            if(g&& g.length > 0) {
              ary.push(g.replace(/"/g,''));
            }
          })
        }

        response.json({
          count: ary.length,
          list: ary
        });

      })
    });

    req.on('error', function(e) {
      console.log('ERROR: ' + e.message);
    });
  }else {
    response.json({
      message: '缺少参数'
    })
  }

});

export {stockCurrentRouter};
