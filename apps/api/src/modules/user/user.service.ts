import httpStatus from 'http-status';
import { Op } from 'sequelize';
import { RoleType } from '@shared';

import { ApiError } from '@/common/errors/ApiError';

import { IOptions, paginate, QueryResult } from '../paginate/paginate';
import { IUser, NewCreatedUser, NewRegisteredUser, UpdateUserBody } from './user.interfaces';
import { hashPassword, User } from './user.model';

/**
 * Convert User model to IUser
 * @param {User} user
 * @returns {IUser}
 */
export const userToIUser = (user: User): IUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    contact: user.contact,
    isEmailVerified: user.isEmailVerified,
    role: user.role,
  };
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {string} [excludeUserId] - The id of the user to be excluded from the check
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (email: string, excludeUserId?: string): Promise<boolean> => {
  if (excludeUserId) {
    const user = await User.findOne({ where: { email, id: { [Op.ne]: excludeUserId } }, paranoid: true });
    return !!user;
  }

  const user = await getUserByEmail(email);
  return !!user;
};

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUser>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUser> => {
  const isEmailAlreadyTaken = await isEmailTaken(userBody.email);

  if (isEmailAlreadyTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const newHashedPassword = await hashPassword(userBody.password);
  const user = await User.create({
    ...userBody,
    role: RoleType.User,
    password: newHashedPassword,
  });

  return userToIUser(user);
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUser>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUser> => {
  const isEmailAlreadyTaken = await isEmailTaken(userBody.email);
  if (isEmailAlreadyTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const newHashedPassword = await hashPassword(userBody.password);
  const user = await User.create({
    ...userBody,
    role: RoleType.User,
    password: newHashedPassword,
  });

  return userToIUser(user);
};

/**
 * Query for users
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult<User>> => {
  const result = await paginate(User, filter, options);
  return result;
};

/**
 * Get user by id
 * @param string id
 * @returns {Promise<IUser | null>}
 */
export const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findByPk(id);

  return userToIUser(user);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUser | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => User.findOne({ where: { email } });

/**
 * Get user by email including password
 * @param {string} email
 * @returns {Promise<IUser | null>}
 */
export const getUserByEmailWithPassword = async (email: string): Promise<IUser | null> => {
  return User.scope('withPassword').findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {string}} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUser | null>}
 */
export const updateUserById = async (userId: string, updateBody: UpdateUserBody): Promise<IUser | null> => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();

  return userToIUser(user);
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IUser | null>}
 */
export const deleteUserById = async (userId: string): Promise<IUser | null> => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.destroy();
  return userToIUser(user);
};

/**
 * Update user password
 * @param string userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<User | null>}
 */
export const updateUserPassword = async (userId: string, updatedPassword: string): Promise<IUser | null> => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const newHashedPassword = await hashPassword(updatedPassword);
  user.password = newHashedPassword;
  await user.save();
  return userToIUser(user);
};
