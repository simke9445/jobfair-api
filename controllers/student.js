const { isBefore, isAfter, format, parse, isWithinRange } = require('date-fns');

const Student = require('../models/student');
const Biography = require('../models/biography');
const JobFair = require('../models/jobFair');
const { getActivePeriodQuery } = require('../utils/query');
const { isTimeWithinRange } = require('../utils/date');

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
      const student = await Student.findById(req.params.id)
        .select('-username')
        .select('-password')
        .populate('biography');

      const [activeJobFair] = await JobFair.find({
        $and: [getActivePeriodQuery('startDate', 'endDate')],
      });

      const biographyUpdateAllowed = activeJobFair &&
        activeJobFair.biographyInterval &&
        isTimeWithinRange(new Date(), activeJobFair.biographyInterval.from, activeJobFair.biographyInterval.to);

      res.statusCode = 200;
      res.json({
        ...student._doc,
        biographyUpdateAllowed,
      });
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

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

      biography.student = student._id;

      const newBiography = await biography.save();

      student.biography = newBiography._id;
      student.save();

      res.statusCode = 200;
      res.json(newBiography);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }
}


module.exports = StudentController;
