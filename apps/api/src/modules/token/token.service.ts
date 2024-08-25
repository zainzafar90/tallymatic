import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import { AuthResponse, IToken, IUser, TokenType } from '@shared';

import config from '@/config/config';
import { ApiError } from '@/common/errors/ApiError';

import { userService } from '../user';
import { User } from '../user/user.model';
import { Token } from './token.model';

/**
 * Generate token
 * @param {string} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  userId: string,
  expires: Moment,
  type: TokenType,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {string} userId
 * @param {Moment} expires
 * @param {TokenType} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
export const saveToken = async (token: IToken): Promise<Token> => {
  const tokenDoc = await Token.create({
    token: token.token,
    userId: token.user,
    expires: token.expires.toDate(),
    type: token.type,
    blacklisted: token.blacklisted || false,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {TokenType} type
 * @returns {Promise<Token>}
 */
export const verifyToken = async (token: string, type: TokenType): Promise<Token> => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({
      where: {
        token,
        type,
        userId: payload.sub,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });
    if (!tokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
    }
    return tokenDoc;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token expired or invalid');
  }
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<AuthResponse>}
 */
export const generateAuthTokens = async (user: IUser): Promise<AuthResponse> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, TokenType.ACCESS);
  await saveToken({
    token: accessToken,
    user: user.id,
    expires: accessTokenExpires,
    type: TokenType.ACCESS,
  });
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, TokenType.REFRESH);
  await saveToken({
    token: accessToken,
    user: user.id,
    expires: refreshTokenExpires,
    type: TokenType.REFRESH,
  });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NO_CONTENT, '');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, TokenType.RESET_PASSWORD);
  await saveToken({
    token: resetPasswordToken,
    user: user.id,
    expires: expires,
    type: TokenType.RESET_PASSWORD,
  });
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user: IUser): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, TokenType.VERIFY_EMAIL);
  await saveToken({
    token: verifyEmailToken,
    user: user.id,
    expires: expires,
    type: TokenType.VERIFY_EMAIL,
  });
  return verifyEmailToken;
};
