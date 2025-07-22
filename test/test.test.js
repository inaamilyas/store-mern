import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';
import Store from '../models/Store.js';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';

const JWT_SECRET = process.env.JWT_SECRET || 'kdjfsafajfddasjfas';
let mongoServer;
let adminToken;
let managerToken;
let storeId;
let userId;
let managerId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const admin = await User.create({
    name: 'Admin Test',
    email: 'admin@test.com',
    password: '$2b$10$hash...', // mock hashed password
    role: 'admin',
  });

  adminToken = jwt.sign({ userId: admin._id, role: 'admin' }, JWT_SECRET);
});

afterAll(async () => {
  if (mongoServer) await mongoServer.stop();
  await mongoose.disconnect();
});

// ----------- USER TESTS -----------
describe('User API', () => {
  test('Admin can create a new manager', async () => {
    // First create a store (since manager must have one)
    const storeRes = await request(app)
      .post('/api/stores')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Electro Store',
        category: 'Electronics',
        floor: 1,
      });

    console.log('storeRes', storeRes);

    const storeId = storeRes.body._id;

    // Now create the manager with the store
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Manager 1',
        email: 'manager1@test.com',
        password: 'pass1234',
        role: 'manager',
        store: storeId,
      });

    console.log('====================================');
    console.log(res);
    console.log('====================================');

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('manager1@test.com');

    managerToken = jwt.sign(
      { userId: res.body._id, role: 'manager' },
      JWT_SECRET,
    );
  });

  test('Admin can view all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Admin can update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Manager' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Manager');
  });

  test('Admin can delete a user', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });
});

// ----------- STORE TESTS -----------
// describe('Store API', () => {
//   test('Admin can create a store', async () => {
//     const res = await request(app)
//       .post('/api/stores')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .send({
//         name: 'Mega Mall',
//         category: 'Fashion',
//         floor: 1,
//         manager: managerId,
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.name).toBe('Mega Mall');
//     storeId = res.body._id;
//   });

//   test('Admin can update the store', async () => {
//     const res = await request(app)
//       .put(`/api/stores/${storeId}`)
//       .set('Authorization', `Bearer ${adminToken}`)
//       .send({ floor: 3 });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.floor).toBe(3);
//   });

//   test('Admin can view all stores', async () => {
//     const res = await request(app)
//       .get('/api/stores')
//       .set('Authorization', `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   test('Admin can delete a store', async () => {
//     const res = await request(app)
//       .delete(`/api/stores/${storeId}`)
//       .set('Authorization', `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toBe('Store deleted successfully');
//   });
// });

// ----------- WALK-IN LOG TESTS -----------
// describe('WalkInLog API', () => {
//   beforeAll(async () => {
//     const store = await Store.create({
//       name: 'Test Store',
//       category: 'Clothing',
//       floor: 2,
//       manager: managerId,
//     });
//     storeId = store._id;
//   });

//   test('Manager can create a walk-in log for their store', async () => {
//     const res = await request(app)
//       .post('/api/walkin-logs')
//       .set('Authorization', `Bearer ${managerToken}`)
//       .send({
//         storeId,
//         estimatedCustomerCount: 25,
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.estimatedCustomerCount).toBe(25);
//   });

//   test('Manager cannot create a walk-in log for unauthorized store', async () => {
//     const fakeStore = await Store.create({
//       name: 'Other Store',
//       category: 'Books',
//       floor: 1,
//       manager: null,
//     });

//     const res = await request(app)
//       .post('/api/walkin-logs')
//       .set('Authorization', `Bearer ${managerToken}`)
//       .send({
//         storeId: fakeStore._id,
//         estimatedCustomerCount: 10,
//       });

//     expect(res.statusCode).toBe(403);
//   });

//   test('Admin can get all walk-in logs', async () => {
//     const res = await request(app)
//       .get('/api/walkin-logs')
//       .set('Authorization', `Bearer ${adminToken}`);

//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   test('Manager can view only their store logs', async () => {
//     const res = await request(app)
//       .get('/api/walkin-logs')
//       .set('Authorization', `Bearer ${managerToken}`);

//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body[0]?.storeId?._id).toBe(storeId.toString());
//   });
// });
