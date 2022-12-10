// MODULE FOR ROUTING

const notesRouter = require('express').Router();
const logger = require('../utils/logger');
const Note = require('../models/note');
const User = require('../models/user');

// get all notes
notesRouter.get(`/`, async (request, response, next) => {
    const notes = await Note.find({});
    response.json(notes);
    // Note.find({})
    //     .then(notes => {
    //         logger.info('Trying to fetch all notes...');
    //         response.json(notes);
    //     })
    //     .catch(err => {
    //         next(err);
    //     });
});

notesRouter.get(`/:id`, async (request, response, next) => {
    const idToGet = request.params.id;

    try {
        const note = await Note.findById(idToGet);
        if (note) {
            response.json(note);
        } else {
            response.status(404).end();
        }
    } catch (exception) {
        next(exception);
    }

    // Note.findById(idToGet)
    //     .then(gotDoc => {
    //         console.log(`GOT ${gotDoc}`);
    //         if (gotDoc) {
    //             response.json(gotDoc);
    //         } else {
    //             response.status(404).end();
    //         }
    //     })
    //     .catch(err => {
    //         next(err);
    //     });

});

notesRouter.post(`/`, async (request, response, next) => {

    // const body = request.body;
    // const user = await User.findById(body.userId);

    // const noteToAdd = new Note({
    //     content: request.body.content,
    //     important: request.body.important,
    //     date: new Date(),
    //     user: user._id
    // });

    try {
        const body = request.body;
        const user = await User.findById(body.userId);

        const noteToAdd = new Note({
            content: request.body.content,
            important: request.body.important,
            date: new Date(),
            user: user._id
        });
        const savedNote = await noteToAdd.save();
        user.notes = user.notes.concat(savedNote._id);
        await user.save();
        response.status(201).json(savedNote);
    } catch (exception) {
        next(exception);
    }

    // const noteToAdd = new Note({
    //     content: request.body.content,
    //     important: request.body.important,
    //     date: new Date()
    // });

    // noteToAdd.save()
    //     .then(result => {
    //         response.status(201).json(result);
    //     })
    //     .catch(err => next(err));

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

notesRouter.delete(`/:id`, async (request, response, next) => {
    const id = request.params.id;

    try {
        const deletedNote = await Note.findByIdAndDelete(id);
        // response.status(204).end();
        response.status(204).json(deletedNote);
    } catch (exception) {
        next(exception);
    }


    // Note.findByIdAndDelete(id)
    //     .then(deletedDoc => {
    //         if (deletedDoc) {
    //             response.status(204).json(deletedDoc);
    //         } else {
    //             response.status(404).send({ 'error': 'could not find requested id' });
    //         }
    //     })
    //     .catch(err => {
    //         logger.error('Failed to delete specified doc.');
    //         response.status(400).send({ 'error': 'failed to delete' });
    //     });

});

module.exports = notesRouter;