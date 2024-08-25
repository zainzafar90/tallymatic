import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthResponse, IUser, UserAuthResponse } from '@shared';

import { catchAsync } from '@/utils/catchAsync';

import { emailService } from '../email';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';

export const register = catchAsync(async (req: Request, res: Response<UserAuthResponse>) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

export const login = catchAsync(async (req: Request, res: Response<AuthResponse>) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send(tokens);
});

export const logout = catchAsync(async (req: Request, res: Response<void>) => {
  await authService.logout(req.body.token);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req: Request, res: Response<UserAuthResponse>) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response<void>) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPassword = catchAsync(async (req: Request, res: Response<void>) => {
  await authService.resetPassword(req.query['token'] as string, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response<void>) => {
  const user = req.user as IUser;

  if (!user) {
    throw new Error('User not found');
  }

  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken, user.name);
  res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmail = catchAsync(async (req: Request, res: Response<void>) => {
  await authService.verifyEmail(req.query['token'] as string);
  res.status(httpStatus.NO_CONTENT).send();
});
