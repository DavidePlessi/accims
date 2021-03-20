const jwtUtils = require('../utils/jwtUtils')

const {errorMessages} = require('../config/messages');

module.exports = (role) => (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ errorCodes: [errorMessages.InvalidToken] });
  }

  // Verify the token
  try {
    const user = jwtUtils.verify(token);
    req.user = {...user};

    if(!!role && parseInt(role) > parseInt(user.role))
      return res.status(401).json({ errorCodes: [errorMessages.NotAuthorized] })

    next();
  } catch (err) {
    res.status(401).json({ errorCodes: [errorMessages.InvalidToken] });
  }
};
