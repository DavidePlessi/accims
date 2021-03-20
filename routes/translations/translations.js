const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const {errorMessages} = require('../../config/messages');
const {HandledException, getFunctionWithErrorCall} = require('../../utils/exception');


const Translation = require('../../models/translations/Translation');

// @route   POST api/translations
// @desc    Create a new Translation
// @access  Private/editor
router.post(
  '/',
  [
    auth(1),
    [
      check('category', errorMessages.TranslationCategoryIsRequired).isString().not().isEmpty(),
      check('key', errorMessages.TranslationKeyIsRequired).isString().not().isEmpty(),
      check('languages', errorMessages.TranslationLanguagesIsRequired).isArray().not().isEmpty(),
    ]
  ],
  getFunctionWithErrorCall(
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw HandledException(400, errors.array().map(x => x.msg))
      }
      return res.json(await Translation.createNewItem(req.body));
    }
  )
);

// @route   GET api/translations
// @desc    Get a list of translations
// @access  Private/editor
router.get(
  '/',
  auth(1),
  getFunctionWithErrorCall(
    async (req, res) => {
      const {
        category,
        key,
        description
      } = req.query
      return res.json(await Translation.getList({category, key, description}));
    }
  )
);

// @route   PATCH api/translations/:id
// @desc    UPDATE a translation
// @access  Private/editor
router.patch(
  '/:id',
  [
    auth(1)
  ],
  getFunctionWithErrorCall(
    async (req, res) => {
      const {
        id
      } = req.params;
      return res.json(await Translation.updateById(id, req.body))
    }
  )
);

// @route   DELETE api/translations/:id
// @desc    UPDATE a translation
// @access  Private/editor
router.delete(
  '/:id',
  [auth(2)],
  getFunctionWithErrorCall(
    async (req, res) => {
      const {
        id
      } = req.params;
      return res.json(await Translation.deleteById(id));
    }
  )
);

module.exports = router;