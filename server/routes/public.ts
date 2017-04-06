/**
 * Created by colin on 2016/12/7.
 */
import { Router, Response, Request } from 'express';
import { CODE, CODE_MESSAGE } from '../codes';

const passport =  require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = [
  {id:1, username:'bob', password:'secret', email: 'bob@example.com'}
];

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

const publicRouter: Router = Router();

publicRouter.get('/simple', (request: Request, response: Response) => {
    response.json({
        title: 'Greetings.',
        text: 'Hello Angular 2'
    });
});

publicRouter.post('/login', passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  },
  (request: Request, response: Response) => {

  }
));

export { publicRouter }
