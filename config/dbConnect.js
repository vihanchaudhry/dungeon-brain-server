const mongoose = require('mongoose');

const connection = {}; /* creating connection object*/

async function dbConnect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return;
  }

  /* connecting to our database */
  const db = await mongoose.connect(
    process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_PROD_URI
      : process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  );

  console.log(`MongoDB connected: ${db.connection.host}`);

  // Setup logging in development mode
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }

  connection.isConnected = db.connections[0].readyState;
}

module.exports = dbConnect;
