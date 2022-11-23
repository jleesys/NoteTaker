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
morgan.token('payload', function (request, response) {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'));

const PORT = process.env.PORT || 3001;
const Note = require('./models/note');

//notes
// let temporaryNotes = [
//     {
//         "content": "Test Note 1",
//         "id": 1,
//         "important": true,
//         "date": "2022-11-19T00:08:45.805Z"
//     },
//     {
//         "content": "Test Note 2",
//         "id": 2,
//         "important": true,
//         "date": "2022-11-19T00:08:45.805Z"
//     },
//     {
//         "content": "Test Note 3",
//         "id": 3,
//         "important": true,
//         "date": "2022-11-19T00:08:45.805Z"
//     },
//     {
//         "content": "Deaf Note",
//         "id": 4,
//         "important": true,
//         "date": "2022-11-19T00:08:45.805Z"
//     }
// ]

app.get(`/`, (request, response) => {
    response.send(`<h1>Hello</h1>`)
})

app.get(`/api/notes`, (request, response, next) => {
    Note.find({})
        .then(notes => {
            response.json(notes);
        })
        .catch(err => {
            next(err);
        })
})

app.get(`/api/notes/:id`, (request, response, next) => {
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
            next(err);
            // console.log(`whoops failed to get the requested doc\nLikely WRONG ID TYPE. \nSubmitted ID: ${idToGet}`)
            // response.status(400).json({ "error": `whoops, malformed id}` })
        })

})

app.post(`/api/notes`, (request, response, next) => {
    // if (!request.body || !request.body.content) {
    //     return response.status(400).json({ "error": "incorrect/missing parameters" });
    // }
    const noteToAdd = new Note({
        content: request.body.content,
        important: request.body.important,
        // date: request.body.date
        // BACK END GENERATED DATE/TIME
        date: new Date()
    })

    noteToAdd.save()
        .then(result => {
            // console.log('Note saved', result)
            response.json(result);
        })
        // .catch(err => console.log('woops, error saving note ', err))
        .catch(err => next(err))

})

app.put(`/api/notes/:id`, (request, response, next) => {
    const id = request.params.id;
    // if (id !== request.body.id) {
    //     return response.status(400).send({"error":`unable to reconcile the requested id ${id}`});
    // }

    const updatedNote = {
        // id: request.body.id,
        content: request.body.content,
        important: request.body.important,
        // date: request.body.date
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
            // response.status(400).send({ "error": `invalid id ${id}` });
            next(err);
        })
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

})

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name == 'CastError') {
        return response.status(400).send({error:'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }
    next(error)
}

app.use(errorHandler);

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`App started on port ${PORT}`)
    } else {
        console.log(`Failed to start on port ${PORT}`)
    }
})