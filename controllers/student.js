const Student = require('../models/student');
const Biography = require('../models/biography');

// TODO: test out this file, probably doesn't work

const { mockBiography, mockStudent } = require('../utils/mocks');

class StudentController {
  /**
   * GET: /students
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getStudents(req, res) {
    try {
      const students = await Student.find({});

      res.statusCode = 200;
      res.json(students);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * GET: /students/:id
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getStudentById(req, res) {
    try {
      const student = await Student.findById(req.payload.id)
                              .populate('biography');

      const mock = mockStudent();

      mock.biography = mockBiography();

      res.statusCode = 200;
      res.json(mock);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  // TODO: check if we need GET request for student biography

  /**
   * POST: /students/:id/biography
   * @param {Request} req 
   * @param {Response} res 
   */
  static async saveBiography(req, res) {
    try {
      const { id } = req.payload;

      const student = await Student.findById(id);
      const biography = new Biography(req.body);

      biography.student = id;

      if (student.biography) {
        biography._id = student.biography;
      }

      await biography.save();

      student.biography = biography;

      res.statusCode = 200;
      res.json(biography);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }
}


module.exports = StudentController;
