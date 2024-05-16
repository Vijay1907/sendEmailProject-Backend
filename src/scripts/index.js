const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

async function scripts() {
  await createFirstAdmin();
}

module.exports = scripts;

async function createFirstAdmin() {
  const result = await Admin.findOne();
  if (result) return;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('1212', salt);

  const admin = new Admin({
    phone: '8851780462',
    email: 'admin@gmail.com',
    name: 'Admin',
    password: hashedPassword,
  });
  await admin.save();
  console.log('New admin is created');
}
