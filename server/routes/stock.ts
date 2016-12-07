/**
 * Created by colin on 2016/12/7.
 */
import { Router, Response, Request } from 'express';
import  MongoHelper  from '../mongo/helper';

const stockRouter: Router = Router();
const helper : MongoHelper = new MongoHelper();

stockRouter.get('/:id',  (request: Request, response: Response) => {
    const stockNo = request.params.id;

    if(stockNo) {
        let ary : any = helper.findDocuments(stockNo);
        console.log(ary);

        if(ary && ary.length > 0 ) {
            response.json({
                stockNo: stockNo,
                list: ary
            })
        } else {
            response.json({
                message: '没有数据'
            })
        }
    } else{
        response.json({
            message: '缺少参数'
        })
    }
});

export {stockRouter}