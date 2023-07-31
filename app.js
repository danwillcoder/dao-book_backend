require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pracRoutes = require('./routes/pracRoutes');
const patientRoutes = require('./routes/patientRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173"]

app.use(cors(
  { origin: (origin, callback) => {
    if(allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  }}
));

// Define separate router instances for each route
const pracRouter = express.Router();
const patientRouter = express.Router();
const prescriptionRouter = express.Router();
const sessionRouter = express.Router();

// Mount each router on the appropriate route path
app.use('/', pracRouter);
app.use('/', patientRouter);
app.use('/', prescriptionRouter);
app.use('/', sessionRouter);

// Set up route handlers for each router
pracRouter.use('/', pracRoutes);
patientRouter.use('/', patientRoutes);
prescriptionRouter.use('/', prescriptionRoutes);
sessionRouter.use('/', sessionRoutes);

// Error handler middleware
app.use(errorHandler);

const mongoose = require('mongoose');

// Database
const database = module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  try {
    mongoose.connect(process.env.DB_CONNECTION_STRING, connectionParams);
    console.log('Connected to the database.');
  } catch (err) {
    console.log(`Could not connect to the database. Exiting now...${err}`);
    process.exit();
  }
}

database()

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
