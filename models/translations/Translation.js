const mongoose = require('mongoose');
const {errorMessages} = require('../../config/messages');
const {HandledException} = require('../../utils/exception');

class TranslationClass {
  static async createNewItem({category, key, description, languages}) {
    const newTranslation = new Translation({category, key, description, languages});
    await newTranslation.save();
    return newTranslation;
  }
  static async getList({category, key, description}, options = {}) {
    const filters = {}
    if(!!category){
      filters.category = category
    }
    if(!!key){
      filters.key = {$regex: '.*' + key + '.*'};
    }
    if(!!description){
      filters.key = {$regex: '.*' + description + '.*'};
    }

    return await this.find(filters, null, options);
  }
  static async updateById(
    id,
    {
      category,
      key,
      description,
      languages
    },
    options = {new : true}
  ) {
    if(!id)
      throw new HandledException(404, errorMessages.NotFound);
    const fields = {};
    if(!!category) fields.category = category;
    if(!!key) fields.key = key;
    if(!!description) fields.description = description;
    if(!!languages && languages.length > 0) fields.languages = languages;

    const exists = !!(await this.findById(id));
    if(!exists)
      throw new HandledException(404, errorMessages.NotFound);

    return await this.findByIdAndUpdate(
      id,
      {$set: fields},
      options
    );
  }
  static async deleteById(id) {
    return this.findByIdAndDelete(id);
  }
}

const TranslationSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TranslationCategory",
    index: true
  },
  key: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String
  },
  languages: [{
    languageCode: {type: String, required: true},
    translation: {type: String}
  }]
});

TranslationSchema.loadClass(TranslationClass);
TranslationSchema.index({category: 1, key: 1}, {unique: true});

const Translation = mongoose.model('Translation', TranslationSchema);

module.exports = Translation;