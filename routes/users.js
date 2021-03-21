const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const {errorMessages} = require("../config/messages");
const auth = require('../middleware/auth');
const jwtUtils = require('../utils/jwtUtils');
const moment = require('moment');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    auth(999),
    [
      check('name', errorMessages.NameIsRequired)
        .not()
        .isEmpty(),
      check('email', errorMessages.InvalidEmail).isEmail(),
      check(
        'password',
        errorMessages.InvalidPassword
      ).isLength({ min: 6 }),
      check('role', errorMessages.RoleRequired)
        .not()
        .isEmpty()
        .isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errorCodes: errors.array().map(x => x.msg) });
    }
    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errorCodes: [errorMessages.UserAlreadyExists]
        });
      }

      const passwordExpirationDate = moment().add(3, 'months').toDate()

      user = new User({
        name,
        email,
        password,
        role,
        passwordExpirationDate
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      return res.json(
        await User.findById(user._id)
          .select('-password')
          .select('-passwordExpirationDate')
      )
    } catch (err) {
      console.error(err.message);
      res.status(500).json({errorCodes: [errorMessages.GenericError]});
    }
  }
);

module.exports = router;
