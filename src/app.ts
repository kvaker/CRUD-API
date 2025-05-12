import dotenv from 'dotenv';
import http from 'http';
import { userRouter } from './routes/users';
import { errorHandler, notFoundHandler } from './utils/handlers';

dotenv.config();

const server = http.createServer(async (req, res) => {
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

export { server };

if (process.env.NODE_ENV !== 'test') {
    server.listen(process.env.PORT, () => {
        console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
}
