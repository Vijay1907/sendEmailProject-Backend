require('dotenv').config();
const mongoose = require('mongoose');
const { connectToDatabase } = require('./config');
const app = require('./src/app');
const scripts = require('./src/scripts');

const { PORT, BASE_URL } = process.env;

(async () => {
  try {
    console.log('Initializing server');
    await connectToDatabase();
    await scripts();
    app.listen(PORT, () => console.log(`Server is running on ${BASE_URL}`)).on('error', shutdown);
  } catch (error) {
    shutdown(error);
  }
})();

async function shutdown(err) {
  console.log('Unable to initialize the server:', err.message);
  await mongoose.connection.close();
  process.exit(1);
}
