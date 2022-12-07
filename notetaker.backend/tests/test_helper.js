const Note = require('../models/note');
const User = require('../models/user');

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

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon', date: new Date() });
    await note.save();
    await note.remove();

    return note._id.toString();
};

const notesInDb = async () => {
    const notes = await Note.find({});
    return notes.map(note => note.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
    // return users.map(user => JSON.stringify(user));
};

module.exports = { initialNotes, nonExistingId, usersInDb, notesInDb };