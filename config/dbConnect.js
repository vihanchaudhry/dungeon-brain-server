/* This is a database connection function*/
const mongoose = require('mongoose');

const connection = {}; /* creating connection object*/

async function dbConnect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return;
  }

  /* connecting to our database */
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log(`MongoDB connected: ${db.connection.host}`);

  // Setup logging in development mode
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }

  connection.isConnected = db.connections[0].readyState;
}

module.exports = dbConnect;
