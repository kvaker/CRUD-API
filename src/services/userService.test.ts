import request from 'supertest';
import { server } from '../app.ts';

describe('Users API', () => {
  let userId: string;

  if (process.env.NODE_ENV !== 'test') {
    server.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  }

  it('should create a new user', async () => {
    const response = await request(server)
      .post('/api/users')
      .send({
        username: 'John Doe',
        age: 30,
        hobbies: ['reading', 'gaming'],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('John Doe');
    expect(response.body.age).toBe(30);
    expect(response.body.hobbies).toEqual(['reading', 'gaming']);
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
    expect(response.body.username).toBe('John Doe');
  });

  it('should update the user', async () => {
    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send({
        username: 'John Doe Updated',
        age: 31,
        hobbies: ['reading', 'traveling'],
      });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('John Doe Updated');
    expect(response.body.age).toBe(31);
    expect(response.body.hobbies).toEqual(['reading', 'traveling']);
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
