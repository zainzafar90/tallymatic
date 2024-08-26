import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import moment from 'moment';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { RoleType, Status, TokenType } from '@shared';

import config from '@/config/config';
import app from '@/app';
import { setupTestDB } from '@/common/jest/setup-test-db';
import { Organization } from '@/modules/organization';
import { tokenService } from '@/modules/token';
import { User } from '@/modules/user/user.model';

setupTestDB();

const password = 'test1234';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

describe('User routes', () => {
  let userOne: any, userTwo: any, userThree, admin: any, userOneAccessToken: string, adminAccessToken: string;

  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
    await Organization.destroy({ where: {}, force: true });

    const organization = await Organization.create({
      name: 'Test Organization',
      status: Status.ACTIVE,
    });

    userOne = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      role: RoleType.Member,
      isEmailVerified: false,
      organizationId: organization.dataValues.id,
    };

    userTwo = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      role: RoleType.Member,
      isEmailVerified: false,
      organizationId: organization.dataValues.id,
    };

    userThree = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      role: RoleType.Member,
      isEmailVerified: false,
      organizationId: organization.dataValues.id,
    };

    admin = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      role: RoleType.Admin,
      isEmailVerified: false,
      organizationId: organization.dataValues.id,
    };

    await User.bulkCreate([userOne, userTwo, userThree, admin]);

    userOneAccessToken = tokenService.generateToken(userOne.id, accessTokenExpires, TokenType.ACCESS);
    adminAccessToken = tokenService.generateToken(admin.id, accessTokenExpires, TokenType.ACCESS);
  });

  describe('POST /v1/users', () => {
    let newUser: any;

    beforeEach(() => {
      newUser = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: RoleType.Member,
        organizationId: userOne.organizationId,
      };
    });

    test('should return 201 and successfully create new user if data is ok', async () => {
      const res = await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: expect.any(String),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organizationId: newUser.organizationId,
        isEmailVerified: false,
        contact: null,
      });

      const dbUser = await User.findByPk(res.body.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organizationId: newUser.organizationId,
        isEmailVerified: false,
        contact: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/users').send(newUser).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newUser)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if email is invalid', async () => {
      newUser.email = 'invalidEmail';

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is already used', async () => {
      newUser.email = userOne.email;

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      newUser.password = 'password';

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      newUser.password = '11111111';

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/users', () => {
    test('should return 200 and apply the default query options', async () => {
      const res = await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        offset: 0,
        limit: 10,
        pages: 1,
        count: 4,
      });
      expect(res.body.results).toHaveLength(4);
      expect(res.body.results[0]).toEqual({
        id: userOne.id,
        role: userOne.role,
        name: userOne.name,
        email: userOne.email,
        organizationId: userOne.organizationId,
        isEmailVerified: userOne.isEmailVerified,
        contact: null,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/v1/users').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all users', async () => {
      await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      const res = await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: userOne.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        offset: 0,
        limit: 10,
        pages: 1,
        count: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(userOne.id);
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      const res = await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        offset: 0,
        limit: 10,
        pages: 1,
        count: 4,
      });
      expect(res.body.results).toHaveLength(4);
      expect(res.body.results[0].id).toBe(admin.id);
      expect(res.body.results[1].id).toBe(userOne.id);
      expect(res.body.results[2].id).toBe(userTwo.id);
      expect(res.body.results[3].id).toBe(userThree.id);
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      const res = await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        offset: 0,
        limit: 10,
        pages: 1,
        count: 4,
      });
      expect(res.body.results).toHaveLength(4);
      expect(res.body.results[0].id).toBe(userOne.id);
      expect(res.body.results[1].id).toBe(userTwo.id);
      expect(res.body.results[2].id).toBe(userThree.id);
      expect(res.body.results[3].id).toBe(admin.id);
    });

    test('should limit returned array if limit param is specified', async () => {
      const res = await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        offset: 0,
        limit: 2,
        pages: 2,
        count: 4,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(userOne.id);
      expect(res.body.results[1].id).toBe(userTwo.id);
    });

    test('should return the correct page if offset and limit params are specified', async () => {
      const res = await request(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ offset: 2, limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        offset: 2,
        limit: 2,
        pages: 2,
        count: 4,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(userThree.id);
    });
  });

  describe('GET /v1/users/:userId', () => {
    test('should return 200 and the user object if data is ok', async () => {
      const res = await request(app)
        .get(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: userOne.id,
        email: userOne.email,
        name: userOne.name,
        role: userOne.role,
        isEmailVerified: userOne.isEmailVerified,
        organizationId: userOne.organizationId,
        contact: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(`/v1/users/${userOne.id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and the user object if admin is trying to get another user', async () => {
      await request(app)
        .get(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if userId is not a valid UUID', async () => {
      await request(app)
        .get('/v1/users/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if user is not found', async () => {
      await request(app)
        .get(`/v1/users/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/users/:userId', () => {
    test('should return 204 if data is ok', async () => {
      await request(app)
        .delete(`/v1/users/${userThree.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await User.findByPk(userThree.id);
      expect(dbUser).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).delete(`/v1/users/${userThree.id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete another user', async () => {
      await request(app)
        .delete(`/v1/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if userId is not a valid UUID', async () => {
      await request(app)
        .delete('/v1/users/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if user already is not found', async () => {
      await request(app)
        .delete(`/v1/users/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/users/:userId', () => {
    test('should return 200 and successfully update user if data is ok', async () => {
      const updateBody = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'newPassword1',
      };

      const res = await request(app)
        .patch(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: userOne.id,
        name: updateBody.name,
        email: updateBody.email,
        role: RoleType.Member,
        isEmailVerified: false,
        organizationId: userOne.organizationId,
        contact: null,
      });

      const dbUser = await User.findByPk(userOne.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(updateBody.password);
      expect(dbUser).toMatchObject({
        name: updateBody.name,
        email: updateBody.email,
        role: 'member',
      });
    });

    test('should return 401 error if access token is missing', async () => {
      const updateBody = { name: faker.person.fullName() };

      await request(app).patch(`/v1/users/${userOne.id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating another user', async () => {
      const updateBody = { name: faker.person.fullName() };

      await request(app)
        .patch(`/v1/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and successfully update user if admin is updating another user', async () => {
      const updateBody = { name: faker.person.fullName() };

      await request(app)
        .patch(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 404 if admin is updating another user that is not found', async () => {
      const updateBody = { name: faker.person.fullName() };

      await request(app)
        .patch(`/v1/users/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid UUID', async () => {
      const updateBody = { name: faker.person.fullName() };

      await request(app)
        .patch(`/v1/users/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is invalid', async () => {
      const updateBody = { email: 'invalidEmail' };

      await request(app)
        .patch(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is already taken', async () => {
      const updateBody = { email: userTwo.email };

      await request(app)
        .patch(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should not return 400 if email is my email', async () => {
      const updateBody = { email: userOne.email };

      await request(app)
        .patch(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 400 if password length is less than 8 characters', async () => {
      const updateBody = { password: 'passwo1' };

      await request(app)
        .patch(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if password does not contain both letters and numbers', async () => {
      const updateBody = { password: 'password' };

      await request(app)
        .patch(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);

      updateBody.password = '11111111';

      await request(app)
        .patch(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/users/me', () => {
    test('should return 200 and the user object', async () => {
      const res = await request(app)
        .get('/v1/users/me')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: userOne.id,
        email: userOne.email,
        name: userOne.name,
        role: userOne.role,
        isEmailVerified: userOne.isEmailVerified,
        organizationId: userOne.organizationId,
        organization: expect.any(Object),
        contact: null,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get('/v1/users/me').send().expect(httpStatus.UNAUTHORIZED);
    });
  });
});
