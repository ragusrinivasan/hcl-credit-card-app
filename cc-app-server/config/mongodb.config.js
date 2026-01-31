const mongoose = require('mongoose');

// MongoDB connection configuration
const connectDB = async () => {
  try {
    // Connection options
    const options = {

      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const mongoURI = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/credit_card_db';

   
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

    
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed due to application termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;