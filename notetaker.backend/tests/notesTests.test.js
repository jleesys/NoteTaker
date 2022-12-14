const mongoose = require('mongoose');
const supertest = require('supertest');
const Note = require('../models/note');
const User = require('../models/user');
const app = require('../app');
const { initialNotes } = require('./test_helper');
const helper = require('./test_helper');
const { json } = require('express');

const api = supertest(app);

// const initialNotes = [
//     {
//         content: 'Make glasses appointment',
//         important: true,
//         date: '2022-11-21T02:29:01.604Z'
//         // id: '637ae26d2431991d8bbe3127'
//     },
//     {
//         content: 'Make dermatologist appointment',
//         important: true,
//         date: '2022-11-21T02:29:01.604Z'
//         // id: '6380125c35552aa96081bc5d'
//     },
//     {
//         content: 'Order dinner',
//         important: false,
//         date: '2022-11-21T02:29:01.604Z'
//         // id: '6382f4f261ea8e89da980d44'
//     }
// ];

beforeEach(async () => {
    await Note.deleteMany({});

    // method 3
    const arrayNoteObjs = initialNotes.map(note => new Note(note));
    const arrayPromises = arrayNoteObjs.map(noteObj => noteObj.save());
    const testUser = new User({ username: 'jblow', name: 'joe blow', passwordHash: 'testhash123' });
    await testUser.save();
    // const returnedUser = await testUser.save();
    // const testUserId = returnedUser._id;
    // console.log(testUserId);

    await Promise.all(arrayPromises);

    // method 2
    // for (let note of initialNotes) {
    //     let noteObject = new Note(note);
    //     await noteObject.save();
    // }

    // method 1
    // let noteObject = new Note(initialNotes[0]);
    // await noteObject.save();
    // noteObject = new Note(initialNotes[1]);
    // await noteObject.save();
    // noteObject = new Note(initialNotes[2]);
    // await noteObject.save();
});

describe('notes api', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all notes are returned', async () => {
        // const response = await api.get('/api/notes');

        const response = await helper.notesInDb();
        expect(response).toHaveLength(helper.initialNotes.length);

        // expect(response.body.length).toBe(initialNotes.length);
        // expect(response.body).toHaveLength(initialNotes.length);
    });

    test('contains note about glasses appointment', async () => {
        const notesReturned = await helper.notesInDb();
        const contents = notesReturned.map(note => note.content);
        expect(contents).toContain('Make glasses appointment');
        // const response = await api.get('/api/notes');

        // const contents = response.body.map(note => note.content);
        // expect(contents).toContain('Make glasses appointment');
    });

    test('a valid note can be added', async () => {
        const testUser = await User.findOne({ username: 'jblow' });

        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
            userId: testUser._id
        };
        if (newNote) console.log('created note');
        console.log(newNote);

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const notesAtEnd = await helper.notesInDb();
        const noteContents = notesAtEnd.map(note => note.content);

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);
        expect(noteContents).toContain('async/await simplifies making async calls');

        // const response = await api.get('/api/notes');
        // const contents = response.body.map(note => note.content);
        // expect(response.body).toHaveLength(initialNotes.length + 1);
        // expect(contents).toContain('async/await simplifies making async calls');
    });

    test('a note without content is not added', async () => {
        const testUser = await User.findOne({ username: 'jblow' });
        const newNote = {
            important: true,
            userId: testUser._id
        };

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400);

        const notesAtEnd = await helper.notesInDb();

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
        // const response = await api.get('/api/notes');
        // expect(response.body).toHaveLength(initialNotes.length);
    });

    test('a specific note can be viewed', async () => {
        const notesAtStart = await helper.notesInDb();

        const noteToView = notesAtStart[0];

        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

        expect(resultNote.body).toEqual(processedNoteToView);
    });

    test('note can be deleted', async () => {
        const notesAtStart = await helper.notesInDb();
        const noteToDelete = notesAtStart[0];

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204);

        const notesAtEnd = await helper.notesInDb();

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

        const contents = notesAtEnd.map(note => note.content);
        expect(contents).not.toContain(noteToDelete.content);
    });
});

afterAll(() => {
    mongoose.connection.close();
});