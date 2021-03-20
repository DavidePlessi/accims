const errorMessages = {
  //Generic 00000
  GenericError: 'ACMSE00000',
  NotFound: 'ACMSE00001',
  NotAuthorized: 'ACMSE00002',
  InvalidToken: 'ACMSE00003',
  AlreadyExists: 'ACMSE00004',
  //User 10000
  UserIdIsRequired: 'ACMSE10001',
  InvalidCredentials: 'ACMSE10002',
  InvalidEmail: 'ACMSE10003',
  PasswordRequired: 'ACMSE10004',
  InvalidPassword: 'ACMSE10005',
  NameIsRequired: 'ACMSE10006',
  UserAlreadyExists: 'ACMSE10007',
  RoleRequired: 'ACMSE10010',
  //Translation 20000
  TranslationCategoryIsRequired: 'ACMSE20001',
  TranslationKeyIsRequired: 'ACMSE20002',
  TranslationLanguagesIsRequired: 'ACMSE20003',
  TranslationAlreadyExists: 'ACMSE20004',
  //Translation Category 30000
  TranslationCategoryNameIsRequired: 'ACMSE30001',
  //Translation Settings 40000
  TranslationSettingsLanguagesIsRequired: 'ACMSE40001',
};

const infoMessages = {
  //Generic 00000
  CorrectlyRemoved: 'ACMSI00000'
}

module.exports = {
  errorMessages,
  infoMessages
}