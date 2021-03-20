const mongoose = require('mongoose');
const {errorMessages} = require('../../config/messages');
const {HandledException} = require('../../utils/exception');


class TranslationCategoryClass {
  static async createNewItem({name, description}) {
    const newItem = new TranslationCategory({name, description});
    await newItem.save();
    return newItem;
  }
  static async getById(id, options = {}){
    return this.findById(id, null, options);
  }
  static async getList({name, description}, options = {}) {
    const filters = {}
    if(!!name){
      filters.key = {$regex: '.*' + name + '.*'};
    }
    if(!!description){
      filters.key = {$regex: '.*' + description + '.*'};
    }

    return await this.find(filters, null, options);
  }
  static async updateById(
    id,
    {
      name,
      description
    },
    options = {new : true}
  ) {
    if(!id)
      throw new HandledException(404, errorMessages.NotFound);
    const fields = {};
    if(!!name) fields.name = name;
    if(!!description) fields.description = description;

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

const TranslationCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  canCreatFromLevel: {
    type: Number,
    required: true,
    default: 1
  },
  canReadFromLevel: {
    type: Number,
    required: true,
    default: 0
  },
  canUpdateFromLevel: {
    type: Number,
    required: true,
    default: 1
  },
  canDeleteFromLevel: {
    type: Number,
    required: true,
    default: 2
  }
});
TranslationCategorySchema.loadClass(TranslationCategoryClass);

const TranslationCategory = mongoose.model('TranslationCategory', TranslationCategorySchema);

module.exports = TranslationCategory;