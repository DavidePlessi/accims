const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: true
  },
  passwordExpirationDate: {
    type: Date,
    default: () => {
      let date = new Date();
      date = date.setMonth(date.getMonth() + 99);
      return date
    }
  }
});

module.exports = User = mongoose.model('User', UserSchema);