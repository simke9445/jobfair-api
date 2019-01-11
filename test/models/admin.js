const expect = require('chai').expect;

const Admin = require('../../models/admin');
const { mockAdmin } = require('../../utils/mocks');

describe('AdminModel', () => {
  it('should validate', () => {
    let admin = new Admin(mockAdmin());

    expect(admin.kind).to.be.equal('Admin');

    admin.validate(err => {
      expect(err).to.be.null;
    });
  });

  it('should error on empty email', () => {
    let admin = new Admin(mockAdmin());

    admin.email = undefined;

    admin.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on invalid email', () => {
    let admin = new Admin(mockAdmin());

    admin.email = 'test@test@test';

    admin.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on invalid phone number', () => {
    let admin = new Admin(mockAdmin());

    admin.phoneNumber = '123124124124';

    admin.validate(err => {
      expect(err).to.be.not.null;
    });
  });
});