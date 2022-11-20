// allows use of express lib
const express = require('express')
const app = express();
// allows use of json and response methods
const { response, json } = require('express')
app.use(express.json())
// allows use of env vars
require('dotenv').config()
// allows cross origin sharing
const cors = require('cors')
app.use(cors())
// Allows serving of static pages (build directory)
app.use(express.static('build'))
// use MORGAN
var morgan = require('morgan');
morgan.token('payload', function (request, response) {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'));

const PORT = process.env.PORT || 3001;

//notes
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
    // finds the MAX id (the last note posted)
    const arrayOfID = (temporaryNotes.map(note => note.id));
    // console.log('the array of current id', arrayOfID)
    const max = arrayOfID.length ? Math.max(...arrayOfID) : 0;
    // const max = Math.max(...arrayOfID);
    // console.log('the max is gonna be ', typeof max, max)
    // creates var for the NEXT ID to use.
    // if the max is undefined or null (doesnt exist), makes max = 1
    const newID = max + 1;
    console.log('new id ', typeof newID, newID)
    // const newID = Math.max(...temporaryNotes.map(note => note.id)) + 1;
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
    // console.log(request.body);
    if (!request.body || !request.body.content) {
        return response.status(400).json({"error":"incorrect/missing parameters"});
    }
    const noteToAdd = {
        id: generateID(),
        content: request.body.content,
        important: request.body.important,
        date: request.body.date
    }

    temporaryNotes = temporaryNotes.concat(noteToAdd)
    // console.log(noteToAdd);
    response.json(noteToAdd);
})

app.put(`/api/notes/:id`, (request, response) => {
    const id = request.body.id;
    // console.log(typeof id, id, typeof request.params['id'], request.params['id'])
    if (id !== Number(request.params['id'])) {
        return response.status(400).json({"error":"bad request, invalid id"})
    }
    if (!temporaryNotes.find(note => note.id === id)) {
        return response.status(400).json({"error":"id does not exist"})
    }
    if (!request.body || !request.body.content) {
        return response.status(400).json({"error":"incorrect/missing parameters"});
    }
    const updatedNote = {
        id: request.body.id,
        content: request.body.content,
        important: request.body.important,
        date: request.body.date
    }
    // console.log('Updated Note', updatedNote);
    temporaryNotes = temporaryNotes.map(note => note.id !== id ? note : updatedNote);
    // console.log('new note version has been pushed', temporaryNotes)
    response.json(request.body)
})

app.delete(`/api/notes/:id`, (request, response) => {
    const id = Number(request.params.id);
    console.log('my notes right now... before deleting ', temporaryNotes)
    if (!temporaryNotes.find(note => note.id === id)) {
        response.status(400).json({"error":"id does not exist"})
    }
    
    temporaryNotes = temporaryNotes.filter(note => note.id !== id);
    console.log('my notes right now... after deleting ', temporaryNotes)
    response.status(204).end();
})

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`App started on port ${PORT}`)
    } else {
        console.log(`Failed to start on port ${PORT}`)
    }
})