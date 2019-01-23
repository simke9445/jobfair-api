const { bussinessAreas } = require('../constants/index');

const hasMatchedUpperCaseLetters = password => [].filter.call(
  password,
  letter => letter == letter.toUpperCase() && letter.toLowerCase() != letter.toUpperCase(),
).length > 0;

const hasMatchedLowerCaseLetters = password => [].filter.call(
  password,
  letter => letter == letter.toLowerCase() && letter.toLowerCase() != letter.toUpperCase(),
).length > 2;

const hasMatchedNumericLetters = password => [].filter.call(
  password,
  letter => Boolean(Number(letter)),
).length > 0;

const specialCharacters = ['#', '*', '.', '!', '?', '$'];

const hasMatchedSpecialLetters = password => [].filter.call(
  password,
  letter => Boolean(specialCharacters.find(char => char === letter)),
).length > 0;

const hasFirstLetterChar = password => password[0].toLowerCase() != password[0].toUpperCase();

const hasNoTwoSameAdjacentLetters = password => {
  const password1 = password + " ";
  const password2 = " " + password;

  return [].filter.call(
    password1,
    (letter, index) => letter === password2[index],
  ).length == 0;
}

const passwordValidator = [
  { validator: hasMatchedLowerCaseLetters, msg: 'Password requires at least 3 lowercase characters!' },
  { validator: hasMatchedUpperCaseLetters, msg: 'Password requires at least 1 uppercase character!' },
  { validator: hasMatchedNumericLetters, msg: 'Password requires at least 1 numeric character!' },
  { validator: hasMatchedSpecialLetters, msg: 'Password requires at least 1 special character!' },
  { validator: hasFirstLetterChar, msg: 'Password requires for first character to be letter!' },
  { validator: hasNoTwoSameAdjacentLetters, msg: 'Password no two same consecutive characters!' },
];

const phoneNumberValidator = number => /^\d{3}(-)?\d{3}(-)?\d{3,4}$/.test(number);

const emailValidator = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
};

const bussinessAreaValidator = area => {
  return Boolean(Object.values(bussinessAreas).find(x => x === area));
}

module.exports = {
  emailValidator,
  phoneNumberValidator,
  passwordValidator,
  bussinessAreaValidator,
};
