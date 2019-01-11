const expect = require('chai').expect;
const sinon = require('sinon');
const supertest = require('supertest');
const faker = require('faker');

const Student = require('../../models/student');
const app = require('../../app');
const { mockStudents } = require('../../utils/mocks');

describe('StudentsController', () => {
  let findStub;
  let saveStub;

  beforeEach(() => {
    findStub = sinon.stub(Student, 'find');
  });

  afterEach(() => {
    findStub.restore();
  });

  it('.getStudents', () => {
    const students = mockStudents(5);

    findStub.resolves(students);

    return supertest(app)
      .get('/students')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(data => {
        expect(data.body).to.deep.equal(students);
      })
  });
})