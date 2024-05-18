const mongoose = require('mongoose');
const Category = require('./category');

const user = new mongoose.Schema(
  {
    email: { type: String, trim: true, unique: true },
    name: { type: String, trim: true, default: '' },
    nickName: { type: String, trim: true, default: '' },
    address: { type: String, default: '' },
    landLine: { type: String, },
    phone: { type: String, unique: true },
    displayMessage: { type: String, },

    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'users',

  }
);

const User = mongoose.model('User', user);
module.exports = User;
