import { and, asc, count, desc, eq, ne } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreateUserReq, IOptions, RegisterUserReq, RoleType, UpdateUserReq } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { Organization, User, users } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';
import { hashPassword, sanitizeUser } from './user.utils';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof users)['_']['columns'];

interface OrderParams {
  field: OrderField;
  direction: OrderDirection;
}

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

export const registerUser = async (userBody: RegisterUserReq) => {
  const isEmailAlreadyTaken = await isEmailTaken(userBody.email);
  if (isEmailAlreadyTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const hashedPassword = await hashPassword(userBody.password);
  const [user] = await db
    .insert(users)
    .values({
      ...userBody,
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

  const orderParams: OrderParams = {
    field: (options.sortBy as OrderField) || 'createdAt',
    direction: (options.sortOrder as OrderDirection) || 'desc',
  };

  const orderFn = orderParams.direction === 'asc' ? asc : desc;
  const orderByClause = orderFn(users[orderParams.field as keyof (typeof users)['_']['columns']]);

  const [usersCount] = await db
    .select({ count: count(users.id) })
    .from(users)
    .where(whereClause);

  const results = await db.query.users.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: orderByClause,
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

export const updateUserPassword = async (userId: string, updatedPassword: string, organizationId?: string) => {
  const conditions = [eq(users.id, userId)];
  if (organizationId) {
    conditions.push(eq(users.organizationId, organizationId));
  }
  const whereClause = and(...conditions);
  const user = await db.query.users.findFirst({
    where: whereClause,
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const newHashedPassword = await hashPassword(updatedPassword);
  await db.update(users).set({ password: newHashedPassword }).where(whereClause);
  return userDTO(user);
};

export const deleteUserById = async (id: string, organizationId: string) => {
  const [deletedUser] = await db
    .delete(users)
    .where(and(eq(users.id, id), eq(users.organizationId, organizationId)))
    .returning();

  return userDTO(deletedUser);
};

export const getUserById = async (id: string, organizationId?: string) => {
  const conditions = [eq(users.id, id)];
  if (organizationId) {
    conditions.push(eq(users.organizationId, organizationId));
  }

  const whereClause = and(...conditions);

  const user = await db.query.users.findFirst({
    where: whereClause,
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

export const getUserByEmail = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      organization: true,
    },
  });

  if (!user) return null;

  return userDTO(user, user.organization);
};

export const getUserByEmailAndPassword = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      organization: true,
    },
  });

  if (!user) return null;

  return user;
};
