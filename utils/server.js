console.log("Starting the server...");
const app = require('../app');
const connectToDatabase = require('./connect');

const port = process.env.PORT || 5000;

console.log("Connecting to the database...");
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });
}).catch((err) => {
  console.log(`Could not connect to the database. Exiting now...${err}`);
  process.exit(1);
});

