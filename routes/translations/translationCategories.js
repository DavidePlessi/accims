const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const {errorMessages} = require('../../config/messages');
const {HandledException, getFunctionWithErrorCall} = require('../../utils/exception');


const TranslationCategory = require('../../models/translations/TranslationCategory');

// @route   POST api/translation-categories/
// @desc    Create a new Translation Category
// @access  Private/editor
router.post(
  '/',
  [
    auth(1),
    [
      check('name', errorMessages.TranslationCategoryNameIsRequired).not().isEmpty(),
    ]
  ],
  getFunctionWithErrorCall(
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new HandledException(400, errors.array().map(x => x.msg))
      }
      return res.json(await TranslationCategory.createNewItem(req.body));
    }
  )
);

// @route   GET api/translation-categories/
// @desc    Get a list of translation categories
// @access  Private/editor
router.get(
  '/',
  auth(1),
  getFunctionWithErrorCall(
    async (req, res) => {
      const {
        name,
        description
      } = req.query
      return res.json(await TranslationCategory.getList({name, description}));
    }
  )
);

// @route   GET api/translation-categories/:id
// @desc    GeT a translation category
// @access  Private/editor
router.get(
  '/:id',
  [
    auth(1)
  ],
  getFunctionWithErrorCall(
    async (req, res) => {
      const {
        id
      } = req.params;
      return res.json(await TranslationCategory.getById(id))
    }
  )
);

// @route   PATCH api/translation-categories/:id
// @desc    UPDATE a translation category
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
      return res.json(await TranslationCategory.updateById(id, req.body))
    }
  )
);

// @route   DELETE api/translation-categories/:id
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
      return res.json(await TranslationCategory.deleteById(id));
    }
  )
);

module.exports = router;