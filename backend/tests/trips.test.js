const request = require('supertest');
const { app, server } = require('../server');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer, client, db, userId, tripId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('test_db');

    // Create a user for testing
    const user = await db.collection('users').insertOne({
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
        password: 'hashedpassword',
    });
    userId = user.insertedId;
});

afterAll(async () => {
    if (client) await client.close();
    if (mongoServer) await mongoServer.stop();
    if (server) server.close();
    console.log('In-memory test database stopped');
});

describe('Trips APIs', () => {
    it('should create a trip', async () => {
        const res = await request(app)
            .post(`/api/users/${userId}/trips`)
            .send({
                name: 'Vacation',
                city: 'Paris',
                start_date: '2024-01-01',
                end_date: '2024-01-10',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('trip_id');
        tripId = res.body.trip_id;
    });

    it('should fetch all trips', async () => {
        const res = await request(app).get(`/api/users/${userId}/trips`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);
    });

    it('should update a trip', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}/trips/${tripId}`)
            .send({ city: 'London' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Trip updated successfully');
    });

    it('should delete a trip', async () => {
        const res = await request(app).delete(`/api/users/${userId}/trips/${tripId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Trip deleted successfully');
    });
});
