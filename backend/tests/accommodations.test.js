const request = require('supertest');
const { app, server } = require('../server');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer, client, db, userId, tripId, accommodationId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('test_db');

    // Create a user and trip for testing
    const user = await db.collection('users').insertOne({
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
        password: 'hashedpassword',
    });
    userId = user.insertedId;

    const trip = await db.collection('trips').insertOne({
        user_id: userId,
        name: 'Tokyo Trip',
        city: 'Tokyo',
        start_date: '2024-03-01',
        end_date: '2024-03-10',
    });
    tripId = trip.insertedId;
});

afterAll(async () => {
    if (client) await client.close();
    if (mongoServer) await mongoServer.stop();
    if (server) server.close();
    console.log('In-memory test database stopped');
});

describe('Accommodations APIs', () => {
    it('should add accommodation to a trip', async () => {
        const res = await request(app)
            .post(`/api/users/${userId}/trips/${tripId}/accommodations`)
            .send({
                name: 'Hotel Tokyo',
                confirmation_num: 'HOT123',
                address: '123 Tokyo Lane',
                checkin_date: '2024-03-01',
                checkout_date: '2024-03-10',
                checkin_time: '15:00',
                checkout_time: '11:00',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('accommodation_id');
        accommodationId = res.body.accommodation_id;
    });

    it('should fetch all accommodations for a trip', async () => {
        const res = await request(app).get(`/api/users/${userId}/trips/${tripId}/accommodations`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);
    });

    it('should update accommodation', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}/trips/${tripId}/accommodations/${accommodationId}`)
            .send({ name: 'Updated Hotel Tokyo' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Accommodation updated successfully');
    });

    it('should delete accommodation', async () => {
        const res = await request(app).delete(`/api/users/${userId}/trips/${tripId}/accommodations/${accommodationId}`);
        expect(res.statusCode).toBe(200);
    });
});
