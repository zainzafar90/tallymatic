import httpStatus from 'http-status';
import { Op } from 'sequelize';
import {
  CreateUserReq,
  IOptions,
  IUser,
  RegisterUserReq,
  RoleType,
  UpdateUserReq,
  UserListResponse,
  UserProfileResponse,
} from '@shared';

import { ApiError } from '@/common/errors/api-error';

import { Organization } from '../organization';
import { paginate } from '../paginate/paginate';
import { hashPassword, User } from './user.model';

/**
 * Convert User model to IUser
 * @param {User} user
 * @returns {IUser}
 */
export const userToIUser = (user: User): IUser => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    contact: user.contact,
    isEmailVerified: user.isEmailVerified,
    organizationId: user.organizationId,
    role: user.role,
  };
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {string} [excludeUserId] - The id of the user to be excluded from the check
 * @returns {Promise<boolean>}
 */
export const isEmailTaken = async (email: string, excludeUserId?: string): Promise<boolean> => {
  if (excludeUserId) {
    const user = await User.findOne({ where: { email, id: { [Op.ne]: excludeUserId } }, paranoid: true });
    return !!user;
  }

  const user = await getUserByEmail(email);
  return !!user;
};

/**
 * Create a user
 * @param {CreateUserReq} userBody
 * @returns {Promise<IUser>}
 */
export const createUser = async (userBody: CreateUserReq): Promise<IUser> => {
  const isEmailAlreadyTaken = await isEmailTaken(userBody.email);

  if (isEmailAlreadyTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const newHashedPassword = await hashPassword(userBody.password);
  const user = await User.create({
    ...userBody,
    role: RoleType.Member,
    password: newHashedPassword,
  });

  return userToIUser(user);
};

/**
 * Register a user
 * @param {RegisterUserReq} userBody
 * @returns {Promise<IUser>}
 */
export const registerUser = async (userBody: RegisterUserReq): Promise<IUser> => {
  const isEmailAlreadyTaken = await isEmailTaken(userBody.email);
  if (isEmailAlreadyTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const newHashedPassword = await hashPassword(userBody.password);
  const user = await User.create({
    ...userBody,
    role: RoleType.Member,
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
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<UserListResponse> => {
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
 * Get user self by id
 * @param string id
 * @returns {Promise<IUser | null>}
 */
export const getMe = async (id: string): Promise<UserProfileResponse | null> => {
  const user = await User.findByPk(id, {
    include: [
      {
        model: Organization,
        as: 'organization',
      },
    ],
  });

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    contact: user.contact,
    organization: user.organization,
    organizationId: user.organizationId,
    isEmailVerified: user.isEmailVerified,
  };
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
 * @param {UpdateUserReq} updateBody
 * @returns {Promise<IUser | null>}
 */
export const updateUserById = async (userId: string, updateBody: UpdateUserReq): Promise<IUser | null> => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (updateBody.password) {
    // TODO: Do not allow password update here, use another endpoint
    const updatedHashPassword = await hashPassword(updateBody.password);
    Object.assign(user, {
      ...updateBody,
      password: updatedHashPassword,
    });
  } else {
    Object.assign(user, updateBody);
  }

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
 * @param {UpdateUserReq} updateBody
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
