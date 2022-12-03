// MODULE FOR ROUTING

const notesRouter = require('express').Router();
const logger = require('../utils/logger');
const Note = require('../models/note');

notesRouter.get(`/`, (request, response, next) => {
    Note.find({})
        .then(notes => {
            logger.info('Trying to fetch all notes...')
            response.json(notes);
        })
        .catch(err => {
            next(err);
        });
});

notesRouter.get(`/:id`, (request, response, next) => {
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

notesRouter.post(`/`, (request, response, next) => {
    const noteToAdd = new Note({
        content: request.body.content,
        important: request.body.important,
        date: new Date()
    });

    noteToAdd.save()
        .then(result => {
            response.json(result);
        })
        .catch(err => next(err));

});

notesRouter.put(`/:id`, (request, response, next) => {
    const id = request.params.id;
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

notesRouter.delete(`/:id`, (request, response) => {
    const id = request.params.id;
    Note.findByIdAndDelete(id)
        .then(deletedDoc => {
            if (deletedDoc) {
                response.json(deletedDoc);
            } else {
                response.status(404).send({ 'error': 'could not find requested id' });
            }
        })
        .catch(err => {
            logger.error('Failed to delete specified doc.');
            response.status(400).send({ 'error': 'failed to delete' });
        });

});

module.exports = notesRouter;