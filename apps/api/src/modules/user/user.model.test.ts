import { faker } from '@faker-js/faker';
import { RoleType, Status } from '@shared';

import { setupTestDB } from '@/common/jest/jest.setup';

import { Organization } from '../organization';
import { User } from './user.model';

setupTestDB();

describe('User model', () => {
  describe('User validation', () => {
    let newUser: any;

    beforeEach(async () => {
      await User.destroy({ where: {}, force: true });
      await Organization.destroy({ where: {}, force: true });

      const organization = await Organization.create({
        name: 'Test Organization',
        status: Status.ACTIVE,
      });

      newUser = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: RoleType.Member,
        organizationId: organization.id,
        contact: null,
      };
    });

    test('should correctly create a valid user', async () => {
      expect(User.create(newUser)).toBeDefined();
    });

    test('should throw a validation error if email is invalid', async () => {
      newUser.email = 'invalidEmail';
      await expect(User.create(newUser)).rejects.toThrow();
    });

    // test('should throw a validation error if password length is less than 8 characters', async () => {
    //   newUser.password = 'passwo1';
    //   const user = await User.create(newUser);
    //   console.log(user);
    //   await expect(user).rejects.toThrow();
    // });

    //     test('should throw a validation error if password does not contain numbers', async () => {
    //       newUser.password = 'password';
    //       await expect(User.create(newUser)).rejects.toThrow();
    //     });

    //     test('should throw a validation error if password does not contain letters', async () => {
    //       newUser.password = '11111111';
    //       await expect(User.create(newUser)).rejects.toThrow();
    //     });

    //     test('should throw a validation error if role is invalid', async () => {
    //       newUser.role = 'invalid';
    //       await expect(User.create(newUser)).rejects.toThrow();
    //     });
    //   });

    //   describe('User toJSON()', () => {
    //     test('should not return user password when toJSON is called', async () => {
    //       const newUser = {
    //         name: faker.person.fullName(),
    //         email: faker.internet.email().toLowerCase(),
    //         password: 'password1',
    //         role: RoleType.Member,
    //         organizationId: orgId,
    //       };
    //       const user = await User.create(newUser);
    //       console.log(user.toJSON());
    //       expect(user.toJSON()).not.toHaveProperty('password');
    //     });
    //   });

    //   describe('User static methods', () => {
    //     test('isEmailTaken should return false if email is not taken', async () => {
    //       const email = faker.internet.email().toLowerCase();
    //       const result = await userService.isEmailTaken(email);
    //       expect(result).toBe(false);
    //     });

    //     test('isEmailTaken should return true if email is taken', async () => {
    //       const email = faker.internet.email().toLowerCase();
    //       await User.create({
    //         name: faker.person.fullName(),
    //         email,
    //         password: 'password1',
    //         role: RoleType.Member,
    //         organizationId: faker.string.uuid(),
    //       });
    //       const result = await userService.isEmailTaken(email);
    //       expect(result).toBe(true);
    //     });
    //   });

    //   describe('User instance methods', () => {
    //     test('isPasswordMatch should return true if password matches', async () => {
    //       const password = 'password1';
    //       const user = await User.create({
    //         name: faker.person.fullName(),
    //         email: faker.internet.email().toLowerCase(),
    //         password,
    //         role: RoleType.Member,
    //         organizationId: faker.string.uuid(),
    //       });
    //       const isMatch = await isPasswordMatch(password, user);
    //       expect(isMatch).toBe(true);
    //     });

    //     test('isPasswordMatch should return false if password does not match', async () => {
    //       const user = await User.create({
    //         name: faker.person.fullName(),
    //         email: faker.internet.email().toLowerCase(),
    //         password: 'password1',
    //         role: RoleType.Member,
    //         organizationId: faker.string.uuid(),
    //       });
    //       const isMatch = await isPasswordMatch('wrongpassword', user);
    //       console.log(isMatch);
    //       expect(isMatch).toBe(false);
    //     });
  });
});
