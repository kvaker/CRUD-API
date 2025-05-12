
import { IncomingMessage, ServerResponse } from 'http';

export const errorHandler = (err: any, res: ServerResponse) => {
  console.error(err);

  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Something went wrong on the server.' }));
};

export const notFoundHandler = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: `Route ${req.url} not found.` }));
};
