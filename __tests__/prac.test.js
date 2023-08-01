//test suite to test practitioner routes

const request = require('supertest');
const app = require('../app');
const Practitioner = require('../models/pracModel');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();

//connect to mock database
beforeAll(async () => {
    const uri = await mongod.getUri();
    await mongoose.connect(uri);
    }
);

//disconnect from mock database
afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
}
);

//clear mock database
afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany();
    }
}
);

//test practitioner creation
it('has a route handler listening to /api/practitioner for post requests', async () => {
    const response = await request(app).post('/api/practitioner').send({});
    expect(response.status).not.toEqual(404);
}
);

it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/practitioner').send({}).expect(401);
}
);

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app).post('/api/practitioner').send({});
    expect(response.status).not.toEqual(401);
}
);

it('returns an error if an invalid email is provided', async () => {
    await request(app)
        .post('/api/practitioner')
        .send({
            email: 'invalidEmail',
            password: 'password'
        })
        .expect(400);
}
);

it('returns an error if an invalid password is provided', async () => {
    await request(app)
        .post('/api/practitioner')
        .send({
            email: 'teaplease@gmx.com',
            password: 'pass'
        })
        .expect(400);
}
);