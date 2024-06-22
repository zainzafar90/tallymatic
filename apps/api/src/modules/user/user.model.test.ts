// import { faker } from '@faker-js/faker';

// import { Role } from '../permissions/permission.interface';
// import { NewCreatedUser } from './user.interfaces';
// import User from './user.model';

// describe('User model', () => {
//   describe('User validation', () => {
//     let newUser: NewCreatedUser;
//     beforeEach(() => {
//       newUser = {
//         name: faker.person.fullName(),
//         email: faker.internet.email().toLowerCase(),
//         password: 'password1',
//         roles: [Role.User],
//       };
//     });

//     test('should correctly validate a valid user', async () => {
//       await expect(new User(newUser).validate()).resolves.toBeUndefined();
//     });

//     test('should throw a validation error if email is invalid', async () => {
//       newUser.email = 'invalidEmail';
//       await expect(new User(newUser).validate()).rejects.toThrow();
//     });

//     test('should throw a validation error if password length is less than 8 characters', async () => {
//       newUser.password = 'passwo1';
//       await expect(new User(newUser).validate()).rejects.toThrow();
//     });

//     test('should throw a validation error if password does not contain numbers', async () => {
//       newUser.password = 'password';
//       await expect(new User(newUser).validate()).rejects.toThrow();
//     });

//     test('should throw a validation error if password does not contain letters', async () => {
//       newUser.password = '11111111';
//       await expect(new User(newUser).validate()).rejects.toThrow();
//     });

//     test('should throw a validation error if roles are invalid', async () => {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       newUser.roles = 'invalid' as any;
//       await expect(new User(newUser).validate()).rejects.toThrow();
//     });
//   });

//   describe('User toJSON()', () => {
//     test('should not return user password when toJSON is called', () => {
//       const newUser = {
//         name: faker.person.fullName(),
//         email: faker.internet.email().toLowerCase(),
//         password: 'password1',
//         roles: [Role.User],
//       };
//       expect(new User(newUser).toJSON()).not.toHaveProperty('password');
//     });
//   });
// });
