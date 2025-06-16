const express = require('express');
const app = express();
const notFound = require('./utils/notfound');
const errorHandler = require('./utils/errorHandler');


app.use('/api/v1', (req, res) => {
    res.write('Hello World!');
    res.end();
})


// Handle 404
app.use(notFound);

// Global error handler
app.use(errorHandler);


module.exports = app;