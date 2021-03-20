const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const {errorMessages} = require('../../config/messages');
const {HandledException, getFunctionWithErrorCall} = require('../../utils/exception');
const _ = require('lodash');
const fs = require('fs');


const Translation = require('../../models/translations/Translation');
const TranslationCategories = require('../../models/translations/TranslationCategory');
const TranslationSettings = require('../../models/translations/TranslationSettings');
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
// @access  Private/supervisor
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

// @route   POST api/translations/export
// @desc    Exports the translation following the settings
// @access  Private/editor
router.post(
  '/export',
  [auth(1)],
  getFunctionWithErrorCall(
    async (req, res) => {
      return res.json(await generateI18nFile());
    }
  )
);

async function generateI18nFile() {

  const categories = await TranslationCategories.getList({}, {lean: true});
  const settings = await TranslationSettings.getSettings({}, {lean: true});
  const translations = await Translation.getList({}, {lean: true});

  const result = {}
  for(let language of settings.languages){
    result[language] = {};
  }

  const groupedTranslation = _.groupBy(
    translations,
    'category'
  );

  for(let groupKey of Object.keys(groupedTranslation)){
    const category = categories.find(x => x._id.toString() === groupKey);
    for(let translation of groupedTranslation[groupKey]){
      for(let language of settings.languages){
        const key = `${category.name}.${translation.key}`;
        result[language][key] = translation.languages.find(x => x.languageCode === language)?.translation;
      }
    }
  }

  for(let lanFile of Object.keys(result)){
    const path =`./outputData/${lanFile}.json`;
    const body = JSON.stringify(result[lanFile]);
    fs.writeFileSync(path, body);
  }

  return result;
}



module.exports = router;

