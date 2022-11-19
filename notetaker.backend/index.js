const express = require('express')
const app = express();
require('dotenv').config()
const cors = require('cors')
app.use(cors())

const PORT = process.env.PORT;

const temporaryNotes = [
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

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`App started on port ${PORT}`)
    } else {
        console.log(`Failed to start on port ${PORT}`)
    }
})