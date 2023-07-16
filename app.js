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
        mongoose.connect('mongodb+srv://danielkellydev:M0eiruRl2BKQziid@dao-book.bw6ian7.mongodb.net/?retryWrites=true&w=majority', connectionParams);
        console.log('Connected to database.');
    }
    catch (err) {
        console.log(`Could not connect to database. Exiting now...${err}`);
        process.exit();
    }
}

database()

app.listen(5000, () => {
    console.log(`Server listening on port 5000`);
}
);
