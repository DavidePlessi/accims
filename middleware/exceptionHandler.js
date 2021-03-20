const {errorMessages} = require('../config/messages');
const {HandledException} = require('../utils/exception');


const handleErrors = (err, req, res, next) => {
  if (err instanceof HandledException) {
    return res.status(err.Type).json({errorCodes: err.Messages});
  }
  if (err.name === "MongoError" && err.message.startsWith("E11000")){
    return res.status(409).json({errorCodes: [errorMessages.AlreadyExists]})
  }
  console.error(err.message);
  return res.status(500).json({errorCodes: [errorMessages.GenericError]});
}

module.exports = handleErrors;