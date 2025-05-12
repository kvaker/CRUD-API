import { IncomingMessage, ServerResponse } from 'http';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

export const userRouter = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || '';

  if (url === '/api/users' && req.method === 'GET') {
    await getAllUsers(req, res);
  } else if (url.match(/^\/api\/users\/[^/]+$/) && req.method === 'GET') {
    await getUser(req, res);
  } else if (url === '/api/users' && req.method === 'POST') {
    await createUser(req, res);
  } else if (url.match(/^\/api\/users\/[^/]+$/) && req.method === 'PUT') {
    await updateUser(req, res);
  } else if (url.match(/^\/api\/users\/[^/]+$/) && req.method === 'DELETE') {
    await deleteUser(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
  }
};
