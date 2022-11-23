const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL;

// create schema
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 5
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// create model
const Note = mongoose.model('Note', noteSchema);

console.log(url);
mongoose
    .connect(url)
    .then(result => {
        console.log(`connecting to url ${url}`)
        console.log(`connection success`)
    })
    .catch(err => {
        console.log(`woops, connection failed : `, err)
    })

module.exports = Note
