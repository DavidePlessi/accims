const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const {errorMessages} = require('../../config/messages');
const {HandledException, getFunctionWithErrorCall} = require('../../utils/exception');


const TranslationSettings = require('../../models/translations/TranslationSettings');

// @route   POST api/translation-settings
// @desc    Create or update Translation settings
// @access  Private/supervisor
router.post(
  '/',
  [
    auth(2),
    [
      check('languages', errorMessages.TranslationSettingsLanguagesIsRequired).isArray().not().isEmpty(),
    ]
  ],
  getFunctionWithErrorCall(
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw HandledException(400, errors.array().map(x => x.msg))
      }
      return res.json(await TranslationSettings.createOrUpdateSettings(req.body));
    }
  )
);

// @route   GET api/translation-settings
// @desc    Get Translation settings
// @access  Private/supervisor
router.get(
  '/',
  auth(2),
  getFunctionWithErrorCall(
    async (req, res) => {
      return res.json(await TranslationSettings.getSettings());
    }
  )
);

module.exports = router;