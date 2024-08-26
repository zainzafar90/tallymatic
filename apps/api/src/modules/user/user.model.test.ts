import { faker } from '@faker-js/faker';
import { IUser, RoleType, Status } from '@shared';

import { setupTestDB } from '@/common/jest/jest.setup';

import { userService } from '.';
import { Organization } from '../organization';
import { hashPassword, isPasswordMatch, User } from './user.model';

setupTestDB();

describe('User model', () => {
  describe('User validation', () => {
    let newUser: IUser;
    let orgId: string;

    beforeEach(async () => {
      await User.destroy({ where: {}, force: true });
      await Organization.destroy({ where: {}, force: true });

      const organization = await Organization.create({
        name: 'Test Organization',
        status: Status.ACTIVE,
      });

      orgId = organization.id;
      const hashedPassword = await hashPassword('password1');
      newUser = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role: RoleType.Member,
        organizationId: organization.id,
        contact: null,
      } as IUser;
    });

    test('should correctly create a valid user', async () => {
      const user = await User.create(newUser);
      expect(user.id).toBeDefined();
    });

    test('should throw a validation error if email is invalid', async () => {
      newUser.email = 'invalidEmail';
      await expect(User.create(newUser)).rejects.toThrow();
    });

    // test('should throw a validation error if password length is less than 8 characters', async () => {
    //   newUser.password = await hashPassword('passwo1');
    //   await expect(User.create(newUser)).rejects.toThrow();
    // });

    // test('should throw a validation error if password does not contain numbers', async () => {
    //   newUser.password = await hashPassword('password');
    //   await expect(User.create(newUser)).rejects.toThrow();
    // });

    // test('should throw a validation error if password does not contain letters', async () => {
    //   newUser.password = await hashPassword('11111111');
    //   await expect(User.create(newUser)).rejects.toThrow();
    // });

    test('should throw a validation error if role is invalid', async () => {
      newUser.role = 'invalid' as any;
      await expect(User.create(newUser)).rejects.toThrow();
    });

    describe('User toJSON()', () => {
      test('should not return user password when toJSON is called', async () => {
        const hashedPassword = await hashPassword('password1');

        const newUser = {
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: hashedPassword,
          role: RoleType.Member,
          organizationId: orgId,
        };
        const user = await User.create(newUser);
        expect(user.toJSON()).not.toHaveProperty('password');
      });
    });

    describe('User static methods', () => {
      test('isEmailTaken should return false if email is not taken', async () => {
        const email = faker.internet.email().toLowerCase();
        const result = await userService.isEmailTaken(email);
        expect(result).toBe(false);
      });

      test('isEmailTaken should return true if email is taken', async () => {
        const email = faker.internet.email().toLowerCase();
        const hashedPassword = await hashPassword('password1');
        await User.create({
          name: faker.person.fullName(),
          email,
          password: hashedPassword,
          role: RoleType.Member,
          organizationId: orgId,
        });
        const result = await userService.isEmailTaken(email);
        expect(result).toBe(true);
      });
    });

    describe('User instance methods', () => {
      test('isPasswordMatch should return true if password matches', async () => {
        const password = 'password1';
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: hashedPassword,
          role: RoleType.Member,
          organizationId: orgId,
        });
        const isMatch = await isPasswordMatch(password, user);
        expect(isMatch).toBe(true);
      });

      test('isPasswordMatch should return false if password does not match', async () => {
        const password = 'password1';
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: hashedPassword,
          role: RoleType.Member,
          organizationId: orgId,
        });
        const isMatch = await isPasswordMatch('wrongpassword', user);
        expect(isMatch).toBe(false);
      });
    });
  });
});
