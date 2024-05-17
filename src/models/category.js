const mongoose = require('mongoose');

const category = new mongoose.Schema(
  {
    categoryName: { type: String, trim: true, unique:true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'categories',

  }
);

const Category = mongoose.model('Category', category);
module.exports = Category;
