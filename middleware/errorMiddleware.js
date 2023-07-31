//create Middleware for error handling, so that errors are displayed in a nice format

const errorHandler = (err, req, res, next) => {
    //display error in json format
    res.status(err.statusCode || 500).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;