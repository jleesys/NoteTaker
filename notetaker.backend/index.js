const express = require('express')
const app = express();
require('dotenv').config()

const PORT = process.env.PORT;

app.get(`/`, (request,response) => {
    response.json(`<h1>Hello</h1>`)
})


app.listen(PORT, (err) => {
    if (!err) {
        console.log(`App started on port ${PORT}`)
    } else {
        console.log(`Failed to start on port ${PORT}`)
    }
})