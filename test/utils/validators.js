const expect = require('chai').expect;
const stub = require('sinon');
const faker = require('faker');

const {
  passwordValidator,
  emailValidator,
  phoneNumberValidator,
  bussinessAreaValidator,
} = require('../../utils/validators');

const { bussinessAreas } = require('../../constants');

describe('validators', () => {
  describe('emailValidator', () => {
    it('should success', () => {
      const email = faker.internet.email();

      const result = emailValidator(email);

      expect(result).to.be.true;
    });

    it('should error', () => {
      let email = faker.internet.email();
      email = email.replace("@", ".");

      const result = emailValidator(email);

      expect(result).to.be.false;
    });
  });

  describe('phoneNumberValidator', () => {
    it('should success', () => {
      const phoneNumber = "063-333-333";

      const result = phoneNumberValidator(phoneNumber);

      expect(result).to.be.true;
    });

    it('should error', () => {
      const phoneNumber = faker.random.word();

      const result = phoneNumberValidator(phoneNumber);

      expect(result).to.be.false;
    });
  });

  describe('passwordValidator', () => {
    it('should success', () => {
      const password = "tEst12#@";

      const result = passwordValidator(password);

      expect(result).to.be.true;
    });

    describe('should error', () => {
      it('with less than 1 uppercase char', () => {
        const password = "test12#@";

        const result = passwordValidator(password);
  
        expect(result).to.be.false;
      });
      
      it('with less than 2 lowercase chars', () => {
        const password = "TEST12#@";

        const result = passwordValidator(password);
  
        expect(result).to.be.false;
      });

      it('with less than 1 numeric char', () => {
        const password = "tEstab#@";

        const result = passwordValidator(password);
  
        expect(result).to.be.false;
      });

      it('with less than 1 special char', () => {
        const password = "tEst12AB";

        const result = passwordValidator(password);
  
        expect(result).to.be.false;
      });

      it('with any two same adjacent chars', () => {
        const password = "tEstt12#@";

        const result = passwordValidator(password);
  
        expect(result).to.be.false;
      });

      it('with starting char non-letter', () => {
        const password = "3Est12#@";

        const result = passwordValidator(password);
  
        expect(result).to.be.false;
      });
    });
  });

  describe('bussinessAreaValidator', () => {
    it('should success', () => {
      const area = Object.values(bussinessAreas)[0];

      const result = bussinessAreaValidator(area);

      expect(result).to.be.true;
    });

    it('should error', () => {
      const area = "random";

      const result = bussinessAreaValidator(area);

      expect(result).to.be.false;
    });
  });
})