const express = require('express');
const path = require('path'); // Import the 'path' module
const unspecifiedRoutesHandler = require('./unspecified.route');
const { finalErrorHandler } = require('../errorHandler');
const apiRoute = require('./api.route');

const appRoutes = (app) => {
  app.get('/api/ping', (_, res) => res.status(200).json({ status: true, message: 'Ping Successfully.', timestamp: new Date() }));

  app.use("/uploads", express.static("uploads"));

  // app.use('/public', express.static('public'));
  app.use('/api', apiRoute);
  app.use(unspecifiedRoutesHandler);
  app.use(finalErrorHandler);
};

module.exports = appRoutes;
