const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const appRoutes = require('./routes');

const app = express();

app.use(cors({
    origin: '*', // Allow requests from any origin
    credentials: true,
}));

app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.json({ limit: '100kb' }));

app.use(morgan('dev'));

appRoutes(app);

module.exports = app;
