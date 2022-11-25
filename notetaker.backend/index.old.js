/* eslint-disable no-unused-vars */
// allows use of express lib
const express = require('express');
const app = express();
// allows use of json and response methods
const { response, json } = require('express');
app.use(express.json());
// allows use of env vars
require('dotenv').config();
// allows cross origin sharing
const cors = require('cors');
app.use(cors());
// Allows serving of static pages (build directory)
app.use(express.static('build'));
// use mongo DB
const mongoose = require('mongoose');
// use MORGAN
var morgan = require('morgan');
morgan.token('payload', function (request, response) {return JSON.stringify(request.body);});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'));

const logger = require('./utils/logger');
const config = require('./utils/config');

// eslint-disable-next-line no-undef
// const PORT = process.env.PORT || 3001;
const Note = require('./models/note');

app.get(`/`, (request, response) => {
    response.send(`<h1>Hello</h1>`);
});

app.get(`/api/notes`, (request, response, next) => {
    Note.find({})
        .then(notes => {
            response.json(notes);
        })
        .catch(err => {
            next(err);
        });
});

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
        });

});

app.post(`/api/notes`, (request, response, next) => {
    // if (!request.body || !request.body.content) {
    //     return response.status(400).json({ "error": "incorrect/missing parameters" });
    // }
    console.log('POST route reached');
    const noteToAdd = new Note({
        content: request.body.content,
        important: request.body.important,
        // date: request.body.date
        // BACK END GENERATED DATE/TIME
        date: new Date()
    });

    noteToAdd.save()
        .then(result => {
            // console.log('Note saved', result)
            response.json(result);
        })
        // .catch(err => console.log('woops, error saving note ', err))
        .catch(err => next(err));

});

app.put(`/api/notes/:id`, (request, response, next) => {
    const id = request.params.id;
    // if (id !== request.body.id) {
    //     return response.status(400).send({"error":`unable to reconcile the requested id ${id}`});
    // }

    const updatedNote = {
        content: request.body.content,
        important: request.body.important,
    };

    Note.findByIdAndUpdate(id, updatedNote, { runValidators: true, new: true })
        .then(returnedNote => {
            if (returnedNote) {
                response.json(returnedNote);
            } else {
                response.status(404).send({ 'error': `could not find object by id ${id}` });
            }
        })
        .catch(err => {
            next(err);
        });
});

app.delete(`/api/notes/:id`, (request, response) => {
    const id = request.params.id;
    Note.findByIdAndDelete(id)
        .then(deletedDoc => {
            console.log('deleted Doc: ', deletedDoc);
            if (deletedDoc) {
                response.json(deletedDoc);
            } else {
                response.status(404).send({ 'error': 'could not find requested id' });
            }
        })
        .catch(err => {
            console.log('Oops. Failed to delete doc: \n', err);
            response.status(400).send({ 'error': 'failed to delete' });
        });

});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        console.log('CastError block');
        return response.status(400).send({ error:'malformatted id' });
    } else if (error.name === 'ValidationError') {
        console.log('Validation Error block');
        return response.status(400).json({ error: error.message });
    }
    
    next(error);
};

app.use(errorHandler);

app.listen(config.PORT, (err) => {
    if (!err) {
        // console.log(`App started on port ${config.PORT}`);
        logger.error(`App started on port ${config.PORT}`);
    } else {
        // console.log(`Failed to start on port ${config.PORT}`);
        logger.error(`Failed to start on port ${config.PORT}`);
    }
});