import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;
let app;
let Tenant;

test.before(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.CORS_ORIGINS = 'http://localhost:3000';

  const db = await import('../../src/config/db.js');
  const appModule = await import('../../src/app.js');
  const tenantModel = await import('../../src/models/Tenant.js');

  Tenant = tenantModel.Tenant;
  await db.connectDb();
  await Tenant.create({ slug: 'default', name: 'Default', domain: 'localhost' });
  app = appModule.buildApp().app;
});

test.after(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

test('GET /api/v1/tenant/theme returns tenant branding', async () => {
  const res = await request(app).get('/api/v1/tenant/theme').set('x-tenant-domain', 'localhost');
  assert.equal(res.status, 200);
  assert.equal(res.body.slug, 'default');
});
