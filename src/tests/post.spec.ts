import path from 'path';
import request from 'supertest';
import { app, server } from '../index';
import { Post } from '../models/post';
import { json, post, Responses } from '../utils/constants';
import prisma from '../utils/db';

const type = path.basename(__filename.split('.')[0]);
const types = type + 's';

afterAll(async done => {
  await prisma.$disconnect();
  server.close();
  done();
});

test(`Return list of ${types}`, async () => {
  const response = await request(app).get(`/${types}`).expect('Content-Type', json).expect(200);

  expect(response.body).toBeDefined();
  expect((response.body as Post[]).length).toBeGreaterThanOrEqual(1);
});

test(`Return a single ${type}`, async () => {
  const response = await request(app).get(`/${types}/3`).expect('Content-Type', json).expect(200);

  expect(response.body).toBeDefined();
  expect(response.body as Post).toMatchObject(post);
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
