import path from 'path';
import request from 'supertest';
import { app, server } from '../index';
import { json, user } from '../utils/constants';
import prisma from '../utils/db';
import { sanitizedUser } from './../models/user';
import { Responses } from './../utils/constants';

const type = path.basename(__filename.split('.')[0]);
const types = type + 's';

afterAll(async done => {
  await prisma.$disconnect();
  server.close();
  done();
});

test(`Return list of ${types}, at least 1.`, async () => {
  const response = await request(app).get('/users').expect('Content-Type', json).expect(200);

  expect(response.body).toBeDefined();
  expect((response.body as sanitizedUser[]).length).toBeGreaterThanOrEqual(1);
});

test(`Return a single ${type}`, async () => {
  const response = await request(app).get(`/${types}/3`).expect('Content-Type', json).expect(200);

  expect(response.body).toBeDefined();
  expect(response.body as sanitizedUser).toMatchObject(user);
});

test('Return error on invalid id', async () => {
  const response = await request(app).get(`/${types}/test`).expect('Content-Type', json).expect(400);

  expect(response.body).toBeDefined();
  expect(response.body).toEqual(Responses.invalid_id(type));
});

test('Return error on non existing id', async () => {
  const response = await request(app).get(`/${types}/420`).expect('Content-Type', json).expect(404);

  expect(response.body).toBeDefined();
  expect(response.body).toEqual(Responses.read.none_found(type));
});

test('Fail on create user, invalid request (password too short)', async () => {
  const req = {
    email: 'user@user.dk',
    password: process.env.BASE_PASSWORD!,
  };

  console.log(req);

  const response = await request(app).post(`/register`).send(req).expect('Content-Type', json).expect(400);

  expect(response.body).toBeDefined();
  expect(response.body).toMatchObject({
    error: {
      context: { key: 'password', label: 'password', limit: 6, value: '12345' },
      message: '"password" length must be at least 6 characters long',
      path: ['password'],
      type: 'string.min',
    },
  });
});

test('Fail on create user, invalid request (no display name)', async () => {
  const req = {
    email: 'user@user.dk',
    password: process.env.BASE_PASSWORD! + '6',
  };

  const response = await request(app).post(`/register`).send(req).expect('Content-Type', json).expect(400);

  expect(response.body).toBeDefined();
  expect(response.body).toMatchObject({
    error: {
      message: '"displayName" is required',
      path: ['displayName'],
      type: 'any.required',
      context: {
        label: 'displayName',
        key: 'displayName',
      },
    },
  });
});

test('Create new user', async () => {
  const req = {
    email: 'newuser@newuser.dk',
    password: process.env.BASE_PASSWORD! + '6',
    displayName: 'new user',
  };

  // Redirects to /login after registration. (status 302)
  await request(app).post(`/register`).send(req).expect(302);
});

test('Login with newly created user', async () => {
  const req = {
    email: 'newuser@newuser.dk',
    password: process.env.BASE_PASSWORD! + '6',
  };

  // Redirects to /profile after login. (status 302)
  await request(app).post(`/login`).send(req).expect(302);
});
