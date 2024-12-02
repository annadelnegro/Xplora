const request = require('supertest');
const { app, server } = require('../server');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer, client, db, userId, tripId, activityId;

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
        name: 'Paris Vacation',
        city: 'Paris',
        start_date: '2024-01-01',
        end_date: '2024-01-10',
    });
    tripId = trip.insertedId;
});

afterAll(async () => {
    if (client) await client.close();
    if (mongoServer) await mongoServer.stop();
    if (server) server.close();
    console.log('In-memory test database stopped');
});

describe('Activities APIs', () => {
    it('should create an activity', async () => {
        const res = await request(app)
            .post(`/api/users/${userId}/trips/${tripId}/activities`)
            .send({
                name: 'Eiffel Tower Visit',
                date: '2024-01-02',
                time: '14:00',
                location: 'Eiffel Tower',
                notes: 'Bring a camera!',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('activity_id');
        activityId = res.body.activity_id;
    });

    it('should fetch all activities for a trip', async () => {
        const res = await request(app).get(`/api/users/${userId}/trips/${tripId}/activities`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);
    });

    it('should update an activity', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}/trips/${tripId}/activities/${activityId}`)
            .send({ name: 'Eiffel Tower Sunset Visit' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Activity updated successfully');
    });

    it('should delete an activity', async () => {
        const res = await request(app).delete(`/api/users/${userId}/trips/${tripId}/activities/${activityId}`);
        expect(res.statusCode).toBe(200);
    });
});
