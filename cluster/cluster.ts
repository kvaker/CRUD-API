import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';
import { createServer } from './app';

const numCPUs = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
const basePort = parseInt(process.env.PORT || '4000', 10);

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);
  for (let i = 1; i < numCPUs; i++) {
    cluster.fork({ PORT: (basePort + i).toString() });
  }

  let current = 1;
  const loadBalancer = http.createServer((req, res) => {
    const workerPort = basePort + (current++ % (numCPUs - 1)) + 1;
    const proxy = http.request(
      {
        hostname: 'localhost',
        port: workerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      proxyRes => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );

    req.pipe(proxy, { end: true });
  });

  loadBalancer.listen(basePort, () => {
    console.log(`Load balancer listening on port ${basePort}`);
  });

} else {
  createServer().listen(process.env.PORT, () =>
    console.log(`Worker ${process.pid} listening on port ${process.env.PORT}`)
  );
}
