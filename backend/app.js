const express = require('express');
const app = express();
const notFound = require('./utils/notfound');
const errorHandler = require('./utils/errorHandler');
const cookieParser = require('cookie-parser');


// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// Routes
const adminRoute = require('./routes/admin/admin.routes');
app.use('/api/v1', adminRoute);


// Handle 404
app.use(notFound);

// Global error handler
app.use(errorHandler);


module.exports = app;