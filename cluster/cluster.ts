import cluster from 'cluster';
import os from 'os';
import { fork } from 'child_process';

const numCPUs = os.cpus().length;
const basePort = parseInt(process.env.PORT || '4000');

if (cluster.isPrimary) {
  let current = 0;
  const workers: any[] = [];

  for (let i = 1; i < numCPUs; i++) {
    const workerPort = basePort + i;
    const worker = fork('./dist/app.js', [], {
      env: { ...process.env, PORT: workerPort.toString() },
    });
    workers.push({ port: workerPort, process: worker });
  }

  const http = require('http');
  const server = http.createServer((req: any, res: any) => {
    const proxy = require('http-proxy').createProxyServer();
    const targetPort = workers[current % workers.length].port;
    proxy.web(req, res, { target: `http://localhost:${targetPort}` });
    current++;
  });

  server.listen(basePort, () => {
    console.log(`Load balancer on http://localhost:${basePort}`);
  });
}
