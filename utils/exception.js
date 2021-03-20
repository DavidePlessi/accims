class HandledException extends Error{
  constructor(type, msg) {
    super();
    this.Type = type;
    this.Messages = msg;
  }
}

const getFunctionWithErrorCall = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = {HandledException, getFunctionWithErrorCall}