/**
 * Created by colin on 2016/12/7.
 */

import * as express from 'express';
import {json, urlencoded} from 'body-parser';
import * as path from 'path';
import * as cors from 'cors';
import * as compression from 'compression';

import {publicRouter} from './routes/public';
import {stockRouter} from './routes/stock';
import {stockRecommendRouter} from './routes/stock-recommend';

const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(compression());
app.use(urlencoded({extended: true}));

app.use('/',function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// api routes
app.use('/api/public', publicRouter);
app.use('/api/stock', stockRouter);
app.use('/api/stockRecommend', stockRecommendRouter);

if (app.get('env') === 'production') {

  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, '/../client')));
}

// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next) {
  // res.set({
  //   'Access-Control-Allow-Headers':'Content-Type, Accept',
  //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  //   'Access-Control-Allow-Origin':'*',
  //   'Access-Control-Allow-Credentials': true
  // });

  let err = new Error('Not Found');
  next(err);
});

app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export {app}

