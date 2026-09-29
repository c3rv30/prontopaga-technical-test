export type Role = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
  /** Only present for the `user` role. */
  rut?: string;
}

/** Port for user lookup; swap the in-memory adapter for a database one without touching auth logic. */
export interface UserRepository {
  findByUsername(username: string): Promise<User | undefined>;
}

// Mock users (no persistence required). Plain-text credentials are documented in the README.
const MOCK_USERS: readonly User[] = [
  {
    id: '1',
    username: 'admin',
    passwordHash:
      'scrypt$c5723c68edb72cda258bab6b4390de6e$3bf435e2b530a89956fdfa1ae0c242ac92c2735ee74fc56a12556a454c98e8ff4648eeea8500f122921d1dba465c6732d6d3ea5fccd33e64beee5ed7d8cc1ce2',
    role: 'admin',
  },
  {
    id: '2',
    username: 'user',
    passwordHash:
      'scrypt$019a9f86ca1f524d3adfc4bb281cb3fc$098af660abff2759853d512804b48fc16afab9ed9f170448fe57f4bfdcfe18d4f8b7e1a54b31e4b0a519d4c34ec3f0e4a215959da41c0929bbdbf721c937f981',
    role: 'user',
    rut: '12.345.678-5',
  },
];

export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly users: readonly User[] = MOCK_USERS) {}

  findByUsername(username: string): Promise<User | undefined> {
    return Promise.resolve(
      this.users.find((user) => user.username === username),
    );
  }
}
