const expect = require('chai').expect;

const Company = require('../../models/company');
const { mockCompany } = require('../../utils/mocks');

describe('CompanyModel', () => {
  it('should validate', () => {
    let company = new Company(mockCompany());

    expect(company.kind).to.be.equal('Company');

    company.validate(err => {
      expect(err).to.be.null;
    });
  });

  it('should error on empty email', () => {
    let company = new Company(mockCompany());

    company.email = undefined;

    company.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on invalid email', () => {
    let company = new Company(mockCompany());

    company.email = 'test@test@test';

    company.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on empty name', () => {
    let company = new Company(mockCompany());

    company.name = undefined;

    company.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on empty city', () => {
    let company = new Company(mockCompany());

    company.city = undefined;

    company.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on empty address', () => {
    let company = new Company(mockCompany());

    company.address = undefined;

    company.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on empty pib', () => {
    let company = new Company(mockCompany());

    company.pib = undefined;

    company.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on invalid bussinessArea', () => {
    let company = new Company(mockCompany());

    company.bussinessArea = 'test';

    company.validate(err => {
      expect(err).to.be.not.null;
    });
  });
});