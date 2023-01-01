const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const loginRouter = require('express').Router();
const logger = require('../utils/logger');
const User = require('../models/user');

loginRouter.post('/', async (request, response, next) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    console.log('user found ', user);
    // const passwordMatch = bcrypt(password) === user.passwordHash ? true : false;
    const passwordMatch = user === null ? false : await bcrypt.compare(password, user.passwordHash);
    // console.log(await bcrypt.compare(password, user.passwordHash));
    // console.log(passwordMatch,  user.passwordHash);

    if (!(passwordMatch && user)) {
        // response.status(401).send({ 'error': 'invalid username or password' }).end();
        return response.status(401).json({ error: 'invalid username or password' });
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response
        .status(200)
        .send({ token, username: user.username, name: user.name });
});

// module.exports = { loginRouter };
module.exports = loginRouter;