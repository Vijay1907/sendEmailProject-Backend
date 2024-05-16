const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const appRoutes = require('./routes');

const app = express();


app.use(cors({
    origin: 'https://sendemailfrontend-4ptmyrfmv-vijays-projects-0aa0fd9a.vercel.app', // Adjust the port if necessary
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.json({ limit: '100kb' }));

app.use(morgan('dev'));

appRoutes(app);

module.exports = app;
