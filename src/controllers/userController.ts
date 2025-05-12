import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/memoryDb';
import { User } from '../models/user';
import { validateUuid } from '../utils/validate';

export const getAllUsers = async (req: IncomingMessage, res: ServerResponse) => {
  const users = db.getAll();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url?.split('/').pop();
  if (!userId || !validateUuid(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid user ID' }));
    return;
  }

  const user = db.get(userId);
  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  let body: string = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      const user: User = JSON.parse(body);
      if (!user.username || !user.age || !Array.isArray(user.hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing required fields' }));
        return;
      }

      const newUser: User = { ...user, id: uuidv4() };
      db.add(newUser);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid request body' }));
    }
  });
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url?.split('/').pop();
  if (!userId || !validateUuid(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid user ID' }));
    return;
  }

  let body: string = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      const updatedData: Partial<User> = JSON.parse(body);
      const existingUser = db.get(userId);
      if (!existingUser) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
      }

      const updatedUser = { ...existingUser, ...updatedData };
      db.update(userId, updatedUser);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid request body' }));
    }
  });
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.url?.split('/').pop();
  if (!userId || !validateUuid(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid user ID' }));
    return;
  }

  const user = db.get(userId);
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  db.delete(userId);
  res.writeHead(204);
  res.end();
};
