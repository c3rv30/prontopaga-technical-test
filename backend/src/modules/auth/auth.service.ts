import { AppError } from '../../domain/errors.js';
import { verifyPassword } from './password.js';
import type { User, UserRepository } from './user.repository.js';

// Verified when the username does not exist, so unknown users and wrong
// passwords take the same time and cannot be told apart.
const DUMMY_PASSWORD_HASH =
  'scrypt$9a76d4d4a79ccf8983e77fae247b5435$5f573fc239318cc4a9b3f84cc7f48c833e58db6501c5fe658e3349f8fe3cdb234389e0355bdb615706fc4a4f427d41f0c294edd5942b6844b4ba33283b0ef335';

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async verifyCredentials(username: string, password: string): Promise<User> {
    const user = await this.users.findByUsername(username);
    const isValid = await verifyPassword(
      password,
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !isValid) {
      throw new AppError('UNAUTHORIZED', 'Invalid username or password');
    }
    return user;
  }
}
