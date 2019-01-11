const expect = require('chai').expect;

const User = require('../../models/user');
const { mockUser } = require('../../utils/mocks');

describe('UserModel', () => {
  it('should validate', () => {
    let user = new User(mockUser());

    expect(user.kind).to.be.equal(undefined);

    user.validate(err => {
      expect(err).to.be.null;
    });
  });

  it('should error on invalid password', () => {
    let user = new User(mockUser());

    user.password = '3eSt#2!3';

    user.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on short password', () => {
    let user = new User(mockUser());

    user.password = 'A';

    user.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on long password', () => {
    let user = new User(mockUser());

    user.password = '3eSt#2!3asdasdsadas';

    user.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on empty password', () => {
    let user = new User(mockUser());

    user.password = undefined;

    user.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on empty username', () => {
    let user = new User(mockUser());

    user.username = undefined;

    user.validate(err => {
      expect(err).to.be.not.null;
    });
  });
});