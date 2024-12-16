import { and, eq } from 'drizzle-orm';
import httpStatus from 'http-status';
import { IUser, TokenType } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { tokens } from '@/db/schema';

import { tokenService } from '../token';
import { userService } from '../user';
import { isPasswordMatch } from '../user/user.model';
import { getUserByEmail } from '../user/user.service';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUser> => {
  const includePassword = true;
  const user = await getUserByEmail(email, includePassword);
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
  const tokenDoc = await db.query.tokens.findFirst({
    where: and(eq(tokens.token, token), eq(tokens.type, TokenType.ACCESS)),
  });

  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  await db.delete(tokens).where(eq(tokens.id, tokenDoc.id));
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<UserAuthResponse>}
 */
export const refreshAuth = async (refreshToken: string, organizationId?: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user.id, organizationId);
    if (!user) {
      throw new Error();
    }

    await db.delete(tokens).where(eq(tokens.id, refreshTokenDoc.id));
    const authTokens = await tokenService.generateAuthTokens(user);
    return { user, tokens: authTokens };
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
    await db.delete(tokens).where(eq(tokens.id, resetPasswordTokenDoc.id));
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUser | null>}
 */
export const verifyEmail = async (verifyEmailToken: string, organizationId?: string): Promise<IUser | null> => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, TokenType.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.userId, organizationId);
    if (!user) {
      throw new Error();
    }
    await db.delete(tokens).where(eq(tokens.id, verifyEmailTokenDoc.id));
    const updatedUser = await userService.updateUserById(
      user.id,
      {
        isEmailVerified: true,
      },
      organizationId
    );
    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
