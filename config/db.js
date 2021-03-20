const mongoose = require('mongoose');
const config = require('./config');
const db = config.MONGO_URI

const connectDb = async (callback) => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    if (callback)
      await callback()
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDb;