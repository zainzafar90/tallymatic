import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import config from '../../config/config';
import { IPayload, TokenType } from '../token/token.interfaces';
import { User } from '../user/user.model';

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: IPayload, done) => {
    try {
      if (payload.type !== TokenType.ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await User.findByPk(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
