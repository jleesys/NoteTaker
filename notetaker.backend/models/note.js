const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL;

// create schema
const noteSchema = new mongoose.Schema({
    id: Number,
    content: String,
    important: Boolean,
    date: String
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
    .catch (err => {
    console.log(`woops, connection failed : `, err)
})

module.exports = Note

// mongoose
//     .connect(url)
//     .then(result => {
//         console.log(`connecting to url ${url}`)
//         console.log(`connection success`)
//     })
//     .then(result => {
//         const note = new Note({
//             "content": "Testy Test Test",
//             "id": 69,
//             "important": true,
//             "date": "INSERT DATE HERE 1"
//         })
//         console.log('saving note')
//         return note.save();
//     })
//     .then(result => {
//         console.log('closing connection');
//         return mongoose.connection.close();
//     } )
//     .catch (err => {
//     console.log(`woops, operation failed : `, err)
// })