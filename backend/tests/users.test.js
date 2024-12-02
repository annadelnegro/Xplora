const request = require('supertest');
const { app, server } = require('../server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');

let mongoServer, client, db;

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('test_db');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('Connected to in-memory test database');
});

beforeEach(async () => {
    await db.collection('users').deleteMany({});
    console.log('Cleared users collection');
    const testUser = {
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
        password: hashPassword('securepassword'),
        email_verified: true,
    };
    await db.collection('users').insertOne(testUser);
    console.log('Inserted test user:', testUser);
});

afterAll(async () => {
    if (client) await client.close();
    if (mongoServer) await mongoServer.stop();
    if (server) await server.close();
    console.log('In-memory test database stopped');
});

describe('User API Endpoints', () => {
    it('should successfully register a user', async () => {
        const res = await request(app).post('/api/register').send({
            first_name: 'Bob',
            last_name: 'Johnson',
            email: 'bob@example.com',
            password: 'securepassword',
        });
        console.log('Register response:', res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully. Verification email sent.');
    });

    it('should not register with duplicate email', async () => {
        const res = await request(app).post('/api/register').send({
            first_name: 'Alice',
            last_name: 'Smith',
            email: 'alice@example.com',
            password: 'securepassword',
        });
        console.log('Duplicate registration response:', res.body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Email already exists');
    });

    it('should log in with valid credentials', async () => {
        const res = await request(app).post('/api/login').send({
            email: 'alice@example.com',
            password: 'securepassword',
        });
        console.log('Login response:', res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should fail login with invalid credentials', async () => {
        const res = await request(app).post('/api/login').send({
            email: 'alice@example.com',
            password: 'wrongpassword',
        });
        console.log('Invalid login response:', res.body);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Invalid login or password');
    });
});
