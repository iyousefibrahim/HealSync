const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./app');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Database Connection
let DBUrl = process.env.DATABASE_URL;
const DBPassword = process.env.DATABASE_PASSWORD;
DBUrl = DBUrl.replace('<PASSWORD>', DBPassword);

mongoose.connect(DBUrl)
    .then(() => {
        console.log('Connected to MongoDB...');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Server
app.listen(process.env.PORT || 3300, () => {
    console.log(`Server is running on port ${process.env.PORT || 3300}...`);
});