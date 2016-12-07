/**
 * Created by colin on 2016/12/7.
 */
import { Router, Response, Request } from 'express';

const publicRouter: Router = Router();

publicRouter.get('/simple', (request: Request, response: Response) => {
    response.json({
        title: 'Greetings.',
        text: 'Hello Angular 2'
    });
});

export { publicRouter }
