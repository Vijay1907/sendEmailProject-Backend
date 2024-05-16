
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const clientController = require('../controllers/clientController')

const apiRoute = require('express').Router();

apiRoute.use('/admin', adminController);
apiRoute.use('/user', userController);
apiRoute.use('/client', clientController);

module.exports = apiRoute;
