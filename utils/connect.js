const mongoose = require('mongoose');

// Database connection function
const connectToDatabase = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  console.log('Attempting to connect to the database...');
  return mongoose.connect(process.env.DB_CONNECTION_STRING, connectionParams)
    .then(() => {
      console.log('Connected to the database.');
    })
    .catch((err) => {
      console.log(`Could not connect to the database. Exiting now...${err}`);
      process.exit(1); // Exit the process with an error code (1) to indicate a failure.
    });
};

module.exports = connectToDatabase;