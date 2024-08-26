import httpStatus from 'http-status';
import { IUser, TokenType, UserAuthResponse } from '@shared';

import { ApiError } from '@/common/errors/api-error';

import { tokenService } from '../token';
import { Token } from '../token/token.model';
import { userService } from '../user';
import { isPasswordMatch } from '../user/user.model';
import { getUserByEmailWithPassword } from '../user/user.service';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUser> => {
  const user = await getUserByEmailWithPassword(email);
  if (!user || !(await isPasswordMatch(password, user))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (token: string): Promise<void> => {
  const tokenDoc = await Token.findOne({
    where: {
      token: token,
      type: TokenType.ACCESS,
    },
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await tokenDoc.destroy();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<UserAuthResponse>}
 */
export const refreshAuth = async (refreshToken: string): Promise<UserAuthResponse> => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user.id);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.destroy();
    const tokens = await tokenService.generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, TokenType.ACCESS);
    const user = await userService.getUserById(resetPasswordTokenDoc.userId);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserPassword(user.id, newPassword);
    await Token.destroy({ where: { userId: user.id, type: TokenType.ACCESS } });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUser | null>}
 */
export const verifyEmail = async (verifyEmailToken: string): Promise<IUser | null> => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, TokenType.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.userId);
    if (!user) {
      throw new Error();
    }
    await Token.destroy({ where: { userId: user.id, type: TokenType.VERIFY_EMAIL } });
    const updatedUser = await userService.updateUserById(user.id, {
      isEmailVerified: true,
    });
    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
