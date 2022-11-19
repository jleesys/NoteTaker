const express = require('express')
require('dotenv').config()

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`App started on port ${PORT}`)
    } else {
        console.log(`Failed to start on port ${PORT}`)
    }
})