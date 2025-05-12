import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { getUserById, getAllUsers, createUser, updateUser, deleteUser } from '../services/userService';

export async function userRouter(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const { method, url } = req;

  if (!url?.startsWith('/api/users')) return false;

  const idMatch = url.match(/^\/api\/users\/([0-9a-fA-F-]+)$/);
  const id = idMatch ? idMatch[1] : null;

  if (method === 'GET' && url === '/api/users') {
    const users = await getAllUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    return true;
  }

  if (method === 'GET' && id) {
    if (!isUuid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid UUID' }));
      return true;
    }
    const user = await getUserById(id);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
      return true;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
    return true;
  }

  if (method === 'POST' && url === '/api/users') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const { username, age, hobbies }: { username: string; age: number; hobbies: string[] } = JSON.parse(body);

      if (!username || !age || !hobbies) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing required fields' }));
        return;
      }

      const newUser = await createUser(username, age, hobbies);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });

    return true;
  }

  if (method === 'PUT' && id) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const { username, age, hobbies }: { username: string; age: number; hobbies: string[] } = JSON.parse(body);

      if (!isUuid(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid UUID' }));
        return;
      }

      const updatedUser = await updateUser(id, username, age, hobbies);
      if (!updatedUser) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    });

    return true;
  }

  if (method === 'DELETE' && id) {
    if (!isUuid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid UUID' }));
      return true;
    }

    const deleted = await deleteUser(id);
    if (!deleted) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
      return true;
    }

    res.writeHead(204);
    res.end();
    return true;
  }

  return false;
}
