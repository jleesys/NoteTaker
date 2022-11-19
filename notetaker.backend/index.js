const express = require('express')
const app = express();
const { response, json } = require('express')
app.use(express.json())
require('dotenv').config()
const cors = require('cors')
app.use(cors())

const PORT = process.env.PORT;

let temporaryNotes = [
    {
        "content": "Test Note 1",
        "id": 1,
        "important": true,
        "date": "2022-11-19T00:08:45.805Z"
    },
    {
        "content": "Test Note 2",
        "id": 2,
        "important": true,
        "date": "2022-11-19T00:08:45.805Z"
    },
    {
        "content": "Test Note 3",
        "id": 3,
        "important": true,
        "date": "2022-11-19T00:08:45.805Z"
    },
    {
        "content": "Deaf Note",
        "id": 4,
        "important": true,
        "date": "2022-11-19T00:08:45.805Z"
    }
]

const generateID = () => {
    const newID = Math.max(...temporaryNotes.map(note => note.id)) + 1;
    return newID;
}

app.get(`/`, (request, response) => {
    response.send(`<h1>Hello</h1>`)
})

app.get(`/api/notes`, (request, response) => {
    response.json(temporaryNotes);
})

app.get(`/api/notes/:id`, (request, response) => {
    const id = request.params.id;
    const index = id - 1;
    if (id > temporaryNotes.length || id < 1) {
        response.json({ "error": "note not found" })
    }
    console.log(`fetching notes of id ${id}`)
    response.json(temporaryNotes[index]);
})

app.post(`/api/notes`, (request, response) => {
    console.log(request.body);
    if (!request.body || !request.body.content) {
        response.json({"error":"incorrect/missing parameters"});
    }
    const noteToAdd = {
        id: generateID(),
        content: request.body.content,
        important: request.body.important,
        date: request.body.date
    }

    temporaryNotes = temporaryNotes.concat(noteToAdd)
    console.log(noteToAdd);
    response.json(noteToAdd);
})

app.put(`/api/notes`, (request, response) => {
    const id = request.body.id;
    const updatedNote = {
        id: request.body.id,
        content: request.body.content,
        important: request.body.important,
        date: request.body.date
    }
    console.log('Updated Note', updatedNote);
    temporaryNotes = temporaryNotes.map(note => note.id !== id ? note : updatedNote);
    console.log('new note version has been pushed', temporaryNotes)
    response.json(request.body)
})

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`App started on port ${PORT}`)
    } else {
        console.log(`Failed to start on port ${PORT}`)
    }
})