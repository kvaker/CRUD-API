import { User } from '../models/user.ts';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const DB_FILE = './db.json';

let users = new Map<string, User>();

if (existsSync(DB_FILE)) {
  const raw = readFileSync(DB_FILE, 'utf-8');
  const parsed: User[] = JSON.parse(raw);
  users = new Map(parsed.map(user => [user.id, user]));
}

function saveToFile() {
  const usersArray = Array.from(users.values());
  writeFileSync(DB_FILE, JSON.stringify(usersArray, null, 2));
}

export const db = {
  getAll: () => [...users.values()],
  get: (id: string) => users.get(id),
  add: (user: User) => {
    users.set(user.id, user);
    saveToFile();
  },
  update: (id: string, user: User) => {
    users.set(id, user);
    saveToFile();
  },
  delete: (id: string) => {
    const result = users.delete(id);
    saveToFile();
    return result;
  },
  exists: (id: string) => users.has(id),
};
