require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorMiddleware');
const pracRoutes = require('./routes/pracRoutes');
const patientRoutes = require('./routes/patientRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const sessionRoutes = require('./routes/sessionRoutes');


const app = express();
app.use(express.json());


//CORS
const allowedOrigins = ["http://localhost:5173", "http://www.daobook.com.au", "https://www.daobook.com.au", "http://daobook.com.au", "https://daobook.com.au"]



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

module.exports = app;