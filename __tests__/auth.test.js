require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('auth routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('signs up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'jennag', password: 'testPassword' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'jennag',
          __v: 0
        });
      });
  });
  it('logs in a user', async() => {
    await User.create({ username: 'jennag', password: 'testPassword' });

    request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'jennag', password: 'testPassword' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'jennag',
          __v: 0
        });
      });
  });

  it('fails to login a user with incorrect password', async() => {
    await User.create({ username: 'jennag', password: 'testPassword' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'jennag', password: 'wrongPassword' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid username or password',
          status: 403
        });
      });
  });
});
