import request from 'supertest';
import { createServer } from '../app.ts';
import http from 'http';

describe('Users API', () => {
  let server: http.Server;
  let userId: string;

  beforeAll(() => {
    server = createServer();
    server.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  it('should create a new user', async () => {
    const response = await request(server)
      .post('/api/users')
      .send({ username: 'John Doe', age: 30, hobbies: ['reading', 'gaming'] });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    userId = response.body.id;
  });

  it('should get all users', async () => {
    const response = await request(server).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get user by id', async () => {
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
  });

  it('should update the user', async () => {
    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send({ username: 'John Doe Updated', age: 31, hobbies: ['reading', 'traveling'] });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('John Doe Updated');
  });

  it('should delete the user', async () => {
    const response = await request(server).delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);
  });

  it('should return 404 for deleted user', async () => {
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});
