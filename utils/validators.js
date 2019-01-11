const { bussinessAreas } = require('../constants/index');

const passwordValidator = password => {
  const hasMatchedUpperCaseLetters = [].filter.call(
    password,
    letter => letter == letter.toUpperCase() && letter.toLowerCase() != letter.toUpperCase(),
  ).length > 0;

  const hasMatchedLowerCaseLetters = [].filter.call(
    password,
    letter => letter == letter.toLowerCase() && letter.toLowerCase() != letter.toUpperCase(),
  ).length > 2;

  const hasMatchedNumericLetters = [].filter.call(
    password,
    letter => Boolean(Number(letter)),
  ).length > 0;

  const specialCharacters = ['#', '*', '.', '!', '?', '$'];

  const hasMatchedSpecialLetters = [].filter.call(
    password,
    letter => Boolean(specialCharacters.find(char => char === letter)),
  ).length > 0;

  const hasFirstLetterChar = password[0].toLowerCase() != password[0].toUpperCase();

  const noTwoSameAdjacentLetters = password => {
    const password1 = password + " ";
    const password2 = " " + password;

    return [].filter.call(
      password1,
      (letter, index) => letter === password2[index],
    ).length == 0;
  }

  const hasNoTwoSameAdjacentLetters = noTwoSameAdjacentLetters(password);

  return hasMatchedLowerCaseLetters &&
    hasMatchedUpperCaseLetters &&
    hasMatchedNumericLetters &&
    hasMatchedSpecialLetters &&
    hasFirstLetterChar &&
    hasNoTwoSameAdjacentLetters;
};

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
