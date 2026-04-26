const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Local MongoDB not accessible. Starting in-memory MongoDB for local development... (Data will be lost on restart)');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      } catch (memErr) {
        console.error(`In-Memory DB Error: ${memErr.message}`);
        process.exit(1);
      }
    } else {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

