const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout if MongoDB is unreachable
      bufferCommands: false, // Prevents Mongoose from buffering queries
    });

    console.log('✅ MongoDB Atlas Connected...');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
