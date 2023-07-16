require('dotenv').config();
const express = require('express');
const pracRoutes = require('./routes/pracRoutes');
const app = express();
app.use(express.json());
app.use('/', pracRoutes);

const mongoose = require('mongoose');

// Database
const database = module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    try {
        mongoose.connect(process.env.DB_CONNECTION_STRING, connectionParams);
        console.log('Connected to database.');
    }
    catch (err) {
        console.log(`Could not connect to database. Exiting now...${err}`);
        process.exit();
    }
}

database()

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
}
);
