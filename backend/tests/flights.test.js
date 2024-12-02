const request = require('supertest');
const { app, server } = require('../server');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer, client, db, userId, tripId, flightId;

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
        name: 'London Business Trip',
        city: 'London',
        start_date: '2024-02-01',
        end_date: '2024-02-10',
    });
    tripId = trip.insertedId;
});

afterAll(async () => {
    if (client) await client.close();
    if (mongoServer) await mongoServer.stop();
    if (server) server.close();
    console.log('In-memory test database stopped');
});

describe('Flights APIs', () => {
    it('should add a flight to a trip', async () => {
        const res = await request(app)
            .post(`/api/users/${userId}/trips/${tripId}/flights`)
            .send({
                confirmation_num: 'ABC123',
                flight_num: 'FL789',
                departure_airport: 'JFK',
                arrival_airport: 'LHR',
                departure_time: '10:00',
                arrival_time: '20:00',
                departure_date: '2024-02-01',
                arrival_date: '2024-02-02',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('flight_id');
        flightId = res.body.flight_id;
    });

    it('should fetch all flights for a trip', async () => {
        const res = await request(app).get(`/api/users/${userId}/trips/${tripId}/flights`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);
    });

    it('should update a flight', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}/trips/${tripId}/flights/${flightId}`)
            .send({ flight_num: 'FL999' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Flight updated successfully');
    });

    it('should delete a flight', async () => {
        const res = await request(app).delete(`/api/users/${userId}/trips/${tripId}/flights/${flightId}`);
        expect(res.statusCode).toBe(200);
    });
});
