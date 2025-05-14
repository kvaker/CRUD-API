import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';
import { createServer } from '../src/app.ts';

const numCPUs = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
const basePort = parseInt(process.env.PORT || '4000', 10);

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork({ PORT: (basePort + i + 1).toString() });
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
  const workerPort = process.env.PORT || '4000';
  createServer().listen(workerPort, () =>
    console.log(`Worker ${process.pid} listening on port ${workerPort}`)
  );
}
