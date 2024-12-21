import { and, eq } from 'drizzle-orm';
import httpStatus from 'http-status';
import { IUser, TokenType } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { logger } from '@/common/logger';
import { db } from '@/db';
import { tokens } from '@/db/schema';

import { tokenService } from '../token';
import { userService } from '../user';
import { verifyPassword } from '../user/user.utils';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUser> => {
  try {
    const user = await userService.getUserByEmailAndPassword(email);
    if (!user || !(await verifyPassword(password, user.password))) {
      logger.warn('Failed login attempt', { email });
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    logger.info('User logged in successfully', { userId: user.id, email });
    return user;
  } catch (error) {
    logger.error('Login error', { email, error });
    throw error;
  }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (token: string): Promise<void> => {
  try {
    const tokenDoc = await db.query.tokens.findFirst({
      where: and(eq(tokens.token, token), eq(tokens.type, TokenType.ACCESS)),
    });

    if (!tokenDoc) {
      logger.warn('Logout attempted with invalid token');
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }

    await db.delete(tokens).where(eq(tokens.id, tokenDoc.id));
    logger.info('User logged out successfully', { userId: tokenDoc.userId });
  } catch (error) {
    logger.error('Logout error', { token, error });
    throw error;
  }
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
      logger.warn('Refresh token used for non-existent user', {
        userId: refreshTokenDoc.user.id,
        organizationId,
      });
      throw new Error();
    }

    await db.delete(tokens).where(eq(tokens.id, refreshTokenDoc.id));
    const authTokens = await tokenService.generateAuthTokens(user);
    logger.info('Auth tokens refreshed successfully', { userId: user.id });
    return { user, tokens: authTokens };
  } catch (error) {
    logger.error('Token refresh error', { refreshToken, organizationId, error });
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
      logger.warn('Password reset attempted for non-existent user', {
        userId: resetPasswordTokenDoc.userId,
      });
      throw new Error();
    }
    await userService.updateUserPassword(user.id, newPassword);
    await db.delete(tokens).where(eq(tokens.id, resetPasswordTokenDoc.id));
    logger.info('Password reset successful', { userId: user.id });
  } catch (error) {
    logger.error('Password reset error', { resetPasswordToken, error });
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
      logger.warn('Email verification attempted for non-existent user', {
        userId: verifyEmailTokenDoc.userId,
        organizationId,
      });
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
    logger.info('Email verified successfully', { userId: user.id });
    return updatedUser;
  } catch (error) {
    logger.error('Email verification error', { verifyEmailToken, organizationId, error });
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
