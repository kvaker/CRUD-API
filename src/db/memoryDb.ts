import { User } from '../models/user';

const users = new Map<string, User>();

export const db = {
  getAll: () => [...users.values()],
  get: (id: string) => users.get(id),
  add: (user: User) => users.set(user.id, user),
  update: (id: string, user: User) => users.set(id, user),
  delete: (id: string) => users.delete(id),
  exists: (id: string) => users.has(id),
};
