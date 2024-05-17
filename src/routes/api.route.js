
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/userController')

const apiRoute = require('express').Router();

apiRoute.use('/admin', adminController);
apiRoute.use('/user', userController);
apiRoute.use('/categories', categoryController);

module.exports = apiRoute;
