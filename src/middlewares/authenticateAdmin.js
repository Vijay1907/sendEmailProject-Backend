const { ApiError } = require('../errorHandler');
const Admin = require('../models/admin');
const { verifyAccessToken } = require('../utils');

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('uhjhjh', req.headers)
    const legit = verifyAccessToken(token);
    console.log('legit', legit._id)
    const admin = await Admin.findById(legit._id);
    console.log('admin', admin)
    if (admin) {
      req.admin = admin;
      req.token = token;
      return next();
    }
    throw new ApiError('Access forbidden', 403);
  } catch (err) {
    console.log(err)
    next(err);
  }
};

module.exports = authenticateAdmin;
