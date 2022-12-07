const bcrypt = require('bcrypt');
const supertest = require('supertest');
const { application } = require('express');
const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    }, 10000);

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        console.log(usersAtEnd);
        console.log(usersAtEnd[0]);
        console.log(usersAtEnd[0].username);
        expect(usersAtEnd).toHaveLength(usersAtStart.length +1 );

        const usernames = usersAtEnd.map(u => u.username);

        console.log(usernames);
        expect(usernames).toContain(newUser.username);
    });
});