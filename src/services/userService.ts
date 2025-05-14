import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { db } from '../db/memoryDb.ts';
import { User } from '../models/user.ts';

export const getAllUsers = async (): Promise<User[]> => {
  return db.getAll();
};

export const getUserById = async (id: string): Promise<User | null> => {
  if (!isUuid(id)) return null;
  return db.get(id) || null;
};

export const createUser = async (username: string, age: number, hobbies: string[]): Promise<User> => {
  const newUser: User = {
    id: uuidv4(),
    username,
    age,
    hobbies
  };
  db.add(newUser);
  return newUser;
};

export const updateUser = async (id: string, username: string, age: number, hobbies: string[]): Promise<User | null> => {
  if (!db.exists(id)) return null;

  const updatedUser: User = {
    id,
    username,
    age,
    hobbies
  };

  db.update(id, updatedUser);
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  return db.delete(id);
};
