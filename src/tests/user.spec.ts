import path from 'path';
import request from 'supertest';
import { app, server } from '../index';
import { sanitizedUser } from '../models/user';
import { json, Responses, user } from '../utils/constants';
import prisma from '../utils/db';

const type = path.basename(__filename.split('.')[0]);
const types = type + 's';
const types2 = 'posts';

afterAll(async done => {
  await prisma.$disconnect();
  server.close();
  done();
});

test(`Return list of ${types}`, async () => {
  const response = await request(app).get(`/${types}`).expect('Content-Type', json).expect(200);

  expect(response.body).toBeDefined();
  expect((response.body as sanitizedUser[]).length).toEqual(3);
});

test(`Return list of 4 ${types2}`, async () => {
  const response = await request(app).get(`/${types}/3/${types2}`).expect('Content-Type', json).expect(200);

  expect(response.body).toBeDefined();
  expect((response.body as sanitizedUser[]).length).toEqual(4);
});

test(`Return empty list of ${types2} for non existant user`, async () => {
  const response = await request(app).get(`/${types}/420/${types2}`).expect('Content-Type', json).expect(404);

  expect(response.body).toBeDefined();
  expect(response.body).toEqual(Responses.read.none_found(types2));
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
