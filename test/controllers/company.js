const expect = require('chai').expect;
const sinon = require('sinon');
const supertest = require('supertest');
const faker = require('faker');

const Company = require('../../models/company');
const app = require('../../app');
const { mockCompanies, mockCompany } = require('../../utils/mocks');

describe('CompanyController', () => {
  describe('.getCompanies', () => {
    let findStub;
  
    beforeEach(() => {
      findStub = sinon.stub(Company, 'find');
    });
  
    afterEach(() => {
      findStub.restore();
    });
    it('should return all companies', () => {
      const companies = mockCompanies(5);

      findStub.resolves(companies);

      return supertest(app)
        .get('/companies')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(data => {
          expect(data.body).to.deep.equal(companies);
        });
    });

    describe('should throw validation error', () => {
      it('for incorrect filter query param', () => {
        findStub.resolves([]);

        return supertest(app)
          .get('/companies')
          .query({ filter: JSON.stringify({ name: 'test' }) })
          .expect('Content-Type', /json/)
          .expect(400)
          .catch(err => {
            expect(err).to.be.not.null;
          });
      });
    })

    describe('should filter companies', () => {
      it('by string property', () => {
        const companies = mockCompanies(2);
        const query = {
          '$and': [{ name: { $regex: '.*test.*' }}],
        };

        findStub.withArgs(query).resolves(companies);
        findStub.resolves([]);

        return supertest(app)
          .get('/companies')
          .query({ filter: JSON.stringify({ name: 'test' }) })
          .expect('Content-Type', /json/)
          .expect(200)
          .then(data => {
            expect(data.body).to.deep.equal(companies);
          });
      });

      it('by multiple filters', () => {
        const companies = mockCompanies(2);
        const query = {
          '$and': [{ name: { $regex: '.*name.*' }}, { city: { $regex: '.*city.*' }}],
        };

        findStub.withArgs(query).resolves(companies);
        findStub.resolves([]);

        return supertest(app)
          .get('/companies')
          .query({ filter: JSON.stringify({ name: 'name', city: 'city' })})
          .expect('Content-Type', /json/)
          .expect(200)
          .then(data => {
            expect(data.body).to.deep.equal(companies);
          });
      });
    });
  });
  
  describe('.getCompanyById', () => {
    let findByIdStub;

    beforeEach(() => {
      findByIdStub = sinon.stub(Company, 'findById');
    });

    afterEach(() => {
      findByIdStub.restore();
    });

    it('should return company with id', () => {
      const company = mockCompany();
      const id = faker.random.uuid();

      findByIdStub.resolves(company);

      return supertest(app)
        .get(`/companies/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(data => {
          expect(data.body).to.deep.equal(company);
        });
    });

    describe('should throw validation error', () => {
      it('for missing id param', () => {
        const company = mockCompany();
        const id = faker.random.word();

        findByIdStub.resolves(company);

        return supertest(app)
          .get(`/companies/${id}`)
          .expect('Content-Type', /json/)
          .expect(400)
          .catch(err => {
            expect(err).to.be.not.null;
          });
      });
    });
  });
})