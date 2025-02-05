'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const basename = path.basename(__filename);
const db = {};

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/yourDatabaseName';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);
connection.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

// Load models dynamically
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.modelName] = model;
  });

db.mongoose = mongoose;
db.connection = connection;

module.exports = db;
