const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('notes api', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });
    test('there are three notes', async () => {
        const response = await api.get('/api/notes');

        expect(response.body).toHaveLength(3);
    });
    test('first note is about glasses appt', async () => {
        const response = await api.get('/api/notes');

        expect(response.body[0].content).toBe('Make glasses appointment');
    });
});

afterAll(() => {
    mongoose.connection.close();
});