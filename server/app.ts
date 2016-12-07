/**
 * Created by colin on 2016/12/7.
 */

import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as path from 'path';
import * as cors from 'cors';
import * as compression from 'compression';

import { publicRouter } from './routes/public';
import { stockRouter } from './routes/stock';

const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

// api routes
app.use('/api/public', publicRouter);
app.use('/api/stock', stockRouter);

if (app.get('env') === 'production') {

    // in production mode run application from dist folder
    app.use(express.static(path.join(__dirname, '/../client')));
}

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
    let err = new Error('Not Found');
    next(err);
});

app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});

export { app }

