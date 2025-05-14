import request from 'supertest';
import { createServer } from '../src/app.ts';
import http from 'http';

describe('User API', () => {
  let server: http.Server;
  let createdUserId: string;

  beforeAll(() => {
    server = createServer();
    server.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  it('should return empty user array', async () => {
    const response = await request(server).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a user', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({ username: 'Alice', age: 30, hobbies: ['reading'] });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdUserId = res.body.id;
  });

  it('should get the created user', async () => {
    const res = await request(server).get(`/api/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('Alice');
  });

  it('should update the user', async () => {
    const res = await request(server)
      .put(`/api/users/${createdUserId}`)
      .send({ username: 'Alice Updated', age: 31, hobbies: ['coding'] });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('Alice Updated');
  });

  it('should delete the user', async () => {
    const res = await request(server).delete(`/api/users/${createdUserId}`);
    expect(res.status).toBe(204);
  });

  it('should return 404 for deleted user', async () => {
    const res = await request(server).get(`/api/users/${createdUserId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
