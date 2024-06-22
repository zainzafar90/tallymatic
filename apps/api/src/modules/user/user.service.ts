import httpStatus from 'http-status';
import { Op } from 'sequelize';

import { ApiError } from '@/common/errors/ApiError';

import { IOptions, paginate, QueryResult } from '../paginate/paginate';
import { RoleType } from '../permissions/permission.interface';
import { Role } from './role.model';
import { IUser, NewCreatedUser, NewRegisteredUser, UpdateUserBody } from './user.interfaces';
import { hashPassword, User } from './user.postgres.model';

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {string} [excludeUserId] - The id of the user to be excluded from the check
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (email: string, excludeUserId?: string): Promise<boolean> => {
  if (excludeUserId) {
    const user = await User.findOne({ where: { email, id: { [Op.ne]: excludeUserId } } });
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

  const role = await Role.findOne({ where: { name: RoleType.User } });
  return User.create({
    ...userBody,
    roles: [role],
    password: await hashPassword(userBody.password),
  });
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

  const role = await Role.findOne({ where: { name: RoleType.User } });
  return User.create({
    ...userBody,
    roles: [role],
    password: await hashPassword(userBody.password),
  });
};

/**
 * Query for users
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult<User>> => {
  // const users = await paginate(filter, options);
  const result = await paginate(User, filter, options);
  return result;
};

/**
 * Get user by id
 * @param string id
 * @returns {Promise<User | null>}
 */
export const getUserById = async (id: string): Promise<User | null> => {
  return User.findByPk(id, {
    paranoid: true,
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUser | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => User.findOne({ where: { email } });

/**
 * Update user by id
 * @param {string}} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUser | null>}
 */
export const updateUserById = async (userId: string, updateBody: UpdateUserBody): Promise<IUser | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();

  return user;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IUser | null>}
 */
export const deleteUserById = async (userId: string): Promise<IUser | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.destroy();
  return user;
};

/**
 * Update user password
 * @param string userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<User | null>}
 */
export const updateUserPassword = async (userId: string, updatedPassword: string): Promise<User | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const newHashedPassword = await hashPassword(updatedPassword);
  user.password = newHashedPassword;
  await user.save();
  return user;
};
