const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/config');

const jwtUtils = {
  sign: (user, callback) => {
    jwt.sign(
      {
        user: {
          id: user.id,
          role: user.role
        }
      },
      JWT_SECRET,
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        if (callback) callback(token)
      }
    );
  },
  verify: (token) => {
    const {user} = jwt.verify(token, JWT_SECRET);
    return user;
  }
}

module.exports = jwtUtils;