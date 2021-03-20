const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwtUtils = require('../utils/jwtUtils');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const {errorMessages} = require("../config/messages");

// @route   GET api/auth
// @desc    Get current user
// @access  Public
router.get('/', auth(0), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').select('-passwordExpirationDate');
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({errorCodes: [errorMessages.GenericError]});
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', errorMessages.InvalidEmail).isEmail(),
    check('password', errorMessages.PasswordRequired).exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errorCodes: errors.array().map(x => x.msg) });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errorCodes: [errorMessages.InvalidCredentials]
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errorCodes: [errorMessages.InvalidCredentials]
        });
      }

      jwtUtils.sign(
        user,
        (token) => res.json({ token })
      )
    } catch (err) {
      console.error(err.message);
      res.status(500).json({errorCodes: [errorMessages.GenericError]});
    }
  }
);

module.exports = router;
