const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const appRoutes = require('./routes');

const app = express();

app.use(cors({
    origin: 'https://send-email-frontend.vercel.app', 
    // origin: 'http://localhost:5173', 
    credentials: true,
}));

app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.json({ limit: '100kb' }));

app.use(morgan('dev'));

appRoutes(app);

module.exports = app;
