import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { getUserById, getAllUsers, createUser, updateUser, deleteUser } from '../services/userService';

function getRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

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
  const bodyString = await getRequestBody(req);

  let parsed;
  try {
    parsed = JSON.parse(bodyString);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid JSON' }));
    return true;
  }

  const { username, age, hobbies } = parsed;

  if (!username || !age || !hobbies) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Missing required fields' }));
    return true;
  }

  const newUser = await createUser(username, age, hobbies);
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(newUser));
  return true;
}

  if (method === 'PUT' && id) {
  const body = await new Promise<string>((resolve) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
  });

  const { username, age, hobbies }: { username: string; age: number; hobbies: string[] } = JSON.parse(body);

  if (!isUuid(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid UUID' }));
    return true;
  }

  const updatedUser = await updateUser(id, username, age, hobbies);
  if (!updatedUser) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return true;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(updatedUser));
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
