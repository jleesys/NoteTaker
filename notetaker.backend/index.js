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
// use mongo DB
const mongoose = require('mongoose');
// use MORGAN
var morgan = require('morgan');
app.use(morgan('dev'));

const PORT = process.env.PORT || 3001;
const Note = require('./models/note');

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

// const generateID = () => {
//     // finds the MAX id (the last note posted)
//     // OLD METHOD
//     // const arrayOfID = (temporaryNotes.map(note => note.id));
//     const arrayOfID = collect(Note.find({})).toArray();
//     console.log('the array of current id', arrayOfID)
//     const max = arrayOfID.length ? Math.max(...arrayOfID) : 0;
//     // const max = Math.max(...arrayOfID);
//     console.log('the max is gonna be ', typeof max, max)
//     // creates var for the NEXT ID to use.
//     // if the max is undefined or null (doesnt exist), makes max = 1
//     const newID = max + 1;
//     console.log('new id ', typeof newID, newID)
//     // const newID = Math.max(...temporaryNotes.map(note => note.id)) + 1;
//     return newID;
// }

app.get(`/`, (request, response) => {
    response.send(`<h1>Hello</h1>`)
})

app.get(`/api/notes`, (request, response) => {
    // 11.19 20:14 MongoDB implementation for get all
    Note.find({})
        .then(notes => {
            response.json(notes);
        })
    // response.json(temporaryNotes);
})

app.get(`/api/notes/:id`, (request, response) => {
    const idToGet = request.params.id;

    Note.findById(idToGet)
        .then(gotDoc => {
            console.log(`GOT ${gotDoc}`);
            if (gotDoc) {
                response.json(gotDoc);
            } else {
                response.status(404).end();
            }
        })
        .catch(err => {
            console.log(`whoops failed to get the requested doc\nLikely WRONG ID TYPE. \nSubmitted ID: ${idToGet}`)
            response.status(400).json({ "error": `whoops, malformed id}` })
        })

    // OLD : NO LONGER USING BACKEND GEN ID
    // IMPLEMENT MONGO OBJECT ID 
    // const id = request.params.id;
    // const index = id - 1;
    // if (id > temporaryNotes.length || id < 1) {
    //     response.json({ "error": "note not found" })
    // }
    // console.log(`fetching notes of id ${id}`)
    // response.json(temporaryNotes[index]);
})

app.post(`/api/notes`, (request, response) => {
    // console.log(request.body);
    if (!request.body || !request.body.content) {
        return response.status(400).json({ "error": "incorrect/missing parameters" });
    }
    const noteToAdd = new Note({
        // OLD : LETS NOT GENERATE ID'S ON THE SERVER ANY MORE 
        // INSTEAD, SUBMIT WITHOUT ID PROPERTY
        // id: generateID(),
        content: request.body.content,
        important: request.body.important,
        date: request.body.date
    })

    noteToAdd.save()
        .then(result => {
            console.log('Note saved', result)
            response.json(result);
        })
        .catch(err => console.log('woops, error saving note ', err))

    // OLD TEMP NOTES DB
    // temporaryNotes = temporaryNotes.concat(noteToAdd)
    // console.log(noteToAdd);

    // OLD : LETS RESPOND WITH THE JSON PROVIDED BY DB IN RESPONSE
    // response.json(noteToAdd);
})

app.put(`/api/notes/:id`, (request, response) => {
    // const id = request.body.id;

    const id = request.params.id;
    if (id !== request.body.id) {
        return response.status(400).send({"error":`unable to reconcile the requested id ${id}`});
    }

    const updatedNote = {
        id: request.body.id,
        content: request.body.content,
        important: request.body.important,
        date: request.body.date
    }

    Note.findByIdAndUpdate(id, updatedNote)
        .then(returnedNote => {
            if (returnedNote) {
                response.json(returnedNote);
            } else {
                response.status(404).send({ "error": `could not find object by id ${id}` });
            }
        })
        .catch(err => {
            response.status(400).send({ "error": `invalid id ${id}` });
        })
    // OLD : USING TEMP IN FILE DB
    // if (id !== Number(request.params['id'])) {
    //     return response.status(400).json({"error":"bad request, invalid id"})
    // }
    // if (!temporaryNotes.find(note => note.id === id)) {
    //     return response.status(400).json({"error":"id does not exist"})
    // }
    // if (!request.body || !request.body.content) {
    //     return response.status(400).json({"error":"incorrect/missing parameters"});
    // }
    // const updatedNote = {
    //     id: request.body.id,
    //     content: request.body.content,
    //     important: request.body.important,
    //     date: request.body.date
    // }
    // console.log('Updated Note', updatedNote);
    // temporaryNotes = temporaryNotes.map(note => note.id !== id ? note : updatedNote);
    // console.log('new note version has been pushed', temporaryNotes)
    // response.json(request.body)
})

app.delete(`/api/notes/:id`, (request, response) => {
    const id = request.params.id;
    Note.findByIdAndDelete(id)
        .then(deletedDoc => {
            console.log('deleted Doc: ', deletedDoc);
            if (deletedDoc) {
                response.json(deletedDoc);
            } else {
                response.status(404).send({ "error": "could not find requested id" })
            }
        })
        .catch(err => {
            console.log('Oops. Failed to delete doc: \n', err)
            response.status(400).send({ "error": "failed to delete" })
        })

    // OLD : TESTING WITH TEMP NOTES
    // if (!temporaryNotes.find(note => note.id === id)) {
    //     response.status(400).json({"error":"id does not exist"})
    // }

    // temporaryNotes = temporaryNotes.filter(note => note.id !== id);
    // response.status(204).end();
})

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`App started on port ${PORT}`)
    } else {
        console.log(`Failed to start on port ${PORT}`)
    }
})