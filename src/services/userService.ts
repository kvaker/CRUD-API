import { v4 as uuidv4, validate as isUuid } from 'uuid';

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

let users: User[] = [];

export const getAllUsers = async (): Promise<User[]> => {
  return users;
};

export const getUserById = async (id: string): Promise<User | null> => {
  if (!isUuid(id)) return null;
  return users.find(user => user.id === id) || null;
};

export const createUser = async (username: string, age: number, hobbies: string[]): Promise<User> => {
  const newUser: User = {
    id: uuidv4(),
    username,
    age,
    hobbies
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = async (id: string, username: string, age: number, hobbies: string[]): Promise<User | null> => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) return null;

  users[userIndex] = { id, username, age, hobbies };
  return users[userIndex];
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) return false;

  users.splice(userIndex, 1);
  return true;
};
