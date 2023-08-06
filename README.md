#  Dao Book — Backend

This repo is the back-end functionality for our DaoBook Clinic Management application.

Visit the live site [here](https://daobook.com.au/).

## Tech Stack

**Client:** Vite, React, ReactRouter, TailwindCSS ([repo here](https://github.com/danwillcoder/dao-book_frontend))

**Server:** Node, Express, Mongo, Mongoose.

## Libraries

- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme) for encryption.
- [Cors](https://expressjs.com/en/resources/middleware/cors.html) for managing CORS requests.
- [Express](https://expressjs.com/) for route management, request serving and running middleware.
- [Express-Async-Handler](https://github.com/Abazhenov/express-async-handler) for easily managing async errors.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for issuing and validating JWTs.
- [Moment-Timezone](https://momentjs.com/timezone/) for date parsing.
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server) for testing DB interaction.
- [Mongoose](https://mongoosejs.com/) as an ORM for validation & CRUD functionality.
- [Nodemailer](https://nodemailer.com/about/) for emailing prescription info.

## Installation

Install with npm

```bash
  git clone https://github.com/danwillcoder/dao-book_backend
  cd dao-book_backend
  npm install
  # Set up your .env file with correct values
  npm run dev
```
    
## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Authors

- [@willr42](https://www.github.com/willr42)
- [@danielkellydev](https://github.com/danielkellydev)

