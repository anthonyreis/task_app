const request = require('supertest');
const app = require('../src/app.js');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Anthony',
        email: 'anthony@email.com',
        password: 'test123@'
    }).expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: 'Anthony',
            email: 'anthony@email.com'
        },
        token: user.tokens[0].token
    });
});

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email, 
        password: userOne.password 
    }).expect(200);

    const user = await User.findById(userOneId);
	
    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    });
});

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'random@email.com',
        password: 'random123'
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOne._id);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/perfil.png')
        .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Anthony Reis'
        })
        .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.name).toBe('Anthony Reis');
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Brasil'
        })
        .expect(400);
});