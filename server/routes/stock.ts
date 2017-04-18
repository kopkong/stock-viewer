/**
 * Created by colin on 2016/12/7.
 */
import { Router, Response, Request } from 'express';
import  MongoHelper  from '../mongo/helper';

const stockRouter: Router = Router();
const helper : MongoHelper = new MongoHelper();

stockRouter.get('/:id',  (request: Request, response: Response) => {
    const stockNo = request.params.id;
    const order : String = request.query.order || 'desc';
    const pageIndex : any = request.query.pageIndex || 0;
    const pageSize  : any = request.query.pageSize  || 10;
    const start : Number = pageIndex * pageSize;
    const end   : Number = ( pageIndex + 1) * pageSize;
    const dateStart : Number = request.query.dateStart || 0;
    const dateEnd   : Number = request.query.dateEnd || 0;

    console.log(stockNo);

    let queryParam = <any>{};

    if(dateStart && dateEnd && dateEnd > dateStart) {
      queryParam.$and = [{date: {$lte: dateEnd}}, {date: {$gte: dateStart}}];
    }

    if(stockNo) {
        let query = helper.findDocuments({
          name:stockNo,
          query: queryParam
        });

        query.then(function(value){
            let ary = value;

            // 默认是倒序排列的
            if(order === 'asc') {
                ary = ary.reverse();
            }

            if(ary && ary.length > 0 ) {
                response.json({
                    stockNo: stockNo,
                    count: ary.length,
                    list: ary.slice(start,end)
                })
            } else {
                response.json({
                    message: '没有数据'
                })
            }
        });

    } else {
        response.json({
            message: '缺少参数'
        })
    }
});

export {stockRouter}
