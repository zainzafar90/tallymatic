import { and, count, eq, ne } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreateUserReq, IOptions, RegisterUserReq, RoleType, UpdateUserReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { Organization, User, users } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';
import { hashPassword, sanitizeUser } from './user.utils';

const userDTO = (user: User, organization?: Organization) => {
  const sanitizedUser = sanitizeUser(user);
  return {
    ...sanitizedUser,
    organization,
  };
};

export const isEmailTaken = async (email: string, excludeUserId?: string) => {
  if (excludeUserId) {
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, email), ne(users.id, excludeUserId)),
      with: {
        organization: true,
      },
    });
    return !!user;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      organization: true,
    },
  });
  return !!user;
};

export const createUser = async (userBody: CreateUserReq, organizationId: string) => {
  const isEmailAlreadyTaken = await isEmailTaken(userBody.email);
  if (isEmailAlreadyTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const hashedPassword = await hashPassword(userBody.password);
  const [user] = await db
    .insert(users)
    .values({
      ...userBody,
      organizationId,
      role: RoleType.Member,
      password: hashedPassword,
    })
    .returning();

  return userDTO(user);
};

export const registerUser = async (userBody: RegisterUserReq, organizationId: string) => {
  const isEmailAlreadyTaken = await isEmailTaken(userBody.email, organizationId);
  if (isEmailAlreadyTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const hashedPassword = await hashPassword(userBody.password);
  const [user] = await db
    .insert(users)
    .values({
      ...userBody,
      organizationId,
      role: RoleType.Member,
      password: hashedPassword,
    })
    .returning();

  return userDTO(user);
};

export const queryUsers = async (filter: Record<string, any>, options: IOptions, organizationId: string) => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(users.organizationId, organizationId)];
  if (filter.name) {
    conditions.push(eq(users.name, filter.name));
  }

  const whereClause = and(...conditions);

  const [usersCount] = await db.select({ count: count() }).from(users).where(whereClause);

  const results = await db.query.users.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: users.createdAt,
    with: {
      organization: true,
    },
  });

  return {
    results: results.map((user) => userDTO(user, user.organization)),
    limit,
    offset,
    pages: Math.ceil(usersCount.count / limit),
    count: usersCount.count,
  };
};

export const updateUserById = async (id: string, userBody: UpdateUserReq, organizationId: string) => {
  if (userBody.password) {
    userBody.password = await hashPassword(userBody.password);
  }

  const [updatedUser] = await db
    .update(users)
    .set(userBody)
    .where(and(eq(users.id, id), eq(users.organizationId, organizationId)))
    .returning();

  return userDTO(updatedUser);
};

export const deleteUserById = async (id: string, organizationId: string) => {
  const [deletedUser] = await db
    .delete(users)
    .where(and(eq(users.id, id), eq(users.organizationId, organizationId)))
    .returning();

  return userDTO(deletedUser);
};

export const getUserById = async (id: string, organizationId: string) => {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, id), eq(users.organizationId, organizationId)),
    with: {
      organization: true,
    },
  });

  if (!user) return null;

  return userDTO(user, user.organization);
};

export const getMe = async (id: string, organizationId: string) => {
  const user = await getUserById(id, organizationId);
  if (!user) return null;
  return user;
};

export const getUserByEmail = async (email: string, includePassword = false) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      organization: true,
    },
  });

  if (!user) return null;

  return includePassword ? user : userDTO(user, user.organization);
};
