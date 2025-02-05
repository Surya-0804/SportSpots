const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ✅ No need for deprecated options
    console.log('✅ MongoDB Atlas Connected...');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
