const joi = require('joi');

const validate = (input, validationSchema) => {
  const result = joi.validate(input, validationSchema);

  if (result.error) {
    throw {
      status: 400, // TODO: standardize errors
      message: result.error.message,
    };
  }

  return result.value ? result.value : {};
}

module.exports = {
  validate,
};
