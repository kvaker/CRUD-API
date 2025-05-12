import request from 'supertest';
import { server } from '../src/app';

describe('User API', () => {
  let createdUserId: string;

  it('should return empty user array', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a user', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({ username: 'Alice', age: 30, hobbies: ['reading'] });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdUserId = res.body.id;
  });

  it('should get the created user', async () => {
    const res = await request(server).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('Alice');
  });

  it('should update the user', async () => {
    const res = await request(server)
      .put(`/api/users/${createdUserId}`)
      .send({ username: 'Alice Updated', age: 31, hobbies: ['coding'] });

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('Alice Updated');
  });

  it('should delete the user', async () => {
    const res = await request(server).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(204);
  });

  it('should return 404 for deleted user', async () => {
    const res = await request(server).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(404);
  });
});
