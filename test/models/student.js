const expect = require('chai').expect;

const Student = require('../../models/student');
const { mockStudent } = require('../../utils/mocks');

describe('StudentModel', () => {
  it('should validate', () => {
    let student = new Student(mockStudent());

    expect(student.kind).to.be.equal('Student');

    student.validate(err => {
      expect(err).to.be.null;
    });
  });

  it('should error on empty email', () => {
    let student = new Student(mockStudent());

    student.email = undefined;

    student.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on invalid email', () => {
    let student = new Student(mockStudent());

    student.email = 'test@test@test';

    student.validate(err => {
      expect(err).to.be.not.null;
    });
  });

  it('should error on invalid phone number', () => {
    let student = new Student(mockStudent());

    student.phoneNumber = '123124124124';

    student.validate(err => {
      expect(err).to.be.not.null;
    });
  });
});