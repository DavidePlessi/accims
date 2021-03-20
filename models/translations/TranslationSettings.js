const mongoose = require('mongoose');

class TranslationSettingsClass {
  static async createOrUpdateSettings({languages, exportSettings}) {
    const fields = {};
    if (!!languages) fields.languages = languages;
    if (!!exportSettings) fields.languages = exportSettings;
    let settings = await this.findOne({});
    if (!settings) {
      settings = new TranslationSettings(fields);
      await settings.save();
      return settings
    } else {
      settings = this.findOneAndUpdate(
        {},
        {$set: fields},
        {new: true}
      );
      return settings;
    }
  }
  static async getSettings() {
    return this.findOne({});
  }
}

const TranslationSettingsSchema = new mongoose.Schema({
  languages: [{type: String}],
  exportSettings: [{
    name: {type: String, required: true},
    type: {type: String, required: true},
    loadPath: {type: String}
  }]
});
TranslationSettingsSchema.loadClass(TranslationSettingsClass);

const TranslationSettings = mongoose.model('TranslationSettings', TranslationSettingsSchema);
module.exports = TranslationSettings