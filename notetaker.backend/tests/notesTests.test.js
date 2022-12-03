const mongoose = require('mongoose');
const supertest = require('supertest');
const Note = require('../models/note');
const app = require('../app');

const api = supertest(app);

const initialNotes = [
    {
        content: 'Make glasses appointment',
        important: true,
        date: '2022-11-21T02:29:01.604Z'
        // id: '637ae26d2431991d8bbe3127'
    },
    {
        content: 'Make dermatologist appointment',
        important: true,
        date: '2022-11-21T02:29:01.604Z'
        // id: '6380125c35552aa96081bc5d'
    },
    {
        content: 'Order dinner',
        important: false,
        date: '2022-11-21T02:29:01.604Z'
        // id: '6382f4f261ea8e89da980d44'
    }
];

beforeEach(async () => {
    await Note.deleteMany({});
    let noteObject = new Note(initialNotes[0]);
    await noteObject.save();
    noteObject = new Note(initialNotes[1]);
    await noteObject.save();
    noteObject = new Note(initialNotes[2]);
    await noteObject.save();
});

describe('notes api', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });
    // test('there are three notes', async () => {
    //     const response = await api.get('/api/notes');

    //     expect(response.body).toHaveLength(3);
    // });
    test('all notes are returned', async () => {
        const response = await api.get('/api/notes');

        // expect(response.body.length).toBe(initialNotes.length);
        expect(response.body).toHaveLength(initialNotes.length);
    });

    test('contains note about glasses appointment', async () => {
        const response = await api.get('/api/notes');

        const contents = response.body.map(note => note.content);
        expect(contents).toContain('Make glasses appointment');
    })

    // test('first note is about glasses appt', async () => {
    //     const response = await api.get('/api/notes');

    //     expect(response.body[0].content).toBe('Make glasses appointment');
    // });
});

afterAll(() => {
    mongoose.connection.close();
});