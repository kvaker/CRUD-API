import dotenv from 'dotenv';
import http from 'http';
import { userRouter } from './routes/users.ts';
import { notFoundHandler } from './utils/handlers.ts';

dotenv.config();

export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const handled = await userRouter(req, res);
      if (!handled && !res.writableEnded) {
        notFoundHandler(req, res);
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
      }
    }
  });
}
