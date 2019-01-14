const joi = require('joi');
const { isWithinRange, isAfter } = require('date-fns');

const Contest = require('../models/contest');
const Student = require('../models/student');
const ContestApplication = require('../models/contestApplication');
const { validate } = require('../utils/request');
const { contestTypes, contestApplicationStatus } = require('../constants');
const { convertToQuery, isActivePeriodQuery } = require('../utils/query');

class ContestController {
  /**
   * GET: /contests
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getContests(req, res) {
    try {
      const queryParams = {
        status: req.query.status,
        filter: JSON.parse(req.query.filter || "{}"),
      };
      const { filter, status } = validate(queryParams, requestValidators.getContests);

      const queryArr = [
        convertToQuery(filter),
        status === 'active' && isActivePeriodQuery('from', 'to'),
      ].filter(Boolean);

      const contests = await Contest.find({
        $and: queryArr,
      });

      res.statusCode = 200
      res.json(contests);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * GET: /contests/:id
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getContestById(req, res) {
    // TODO: populate if student applied for this contest
    // and contest is finshed, with contest ratings
    try {
      const { id } = validate(req.params, requestValidators.getContestById);
      const userId = req.payload.id;
      const contest = await Contest.findById(id);

      const isOngoing = isWithinRange(new Date(), contest.from, contest.to);
      const isCompanyContest = userId === contest.company;

      let applications;
      if (isOngoing) {
        applications = await ContestApplication.find({
          contest: contest._id,
        }).populate('student', 'firstName lastName');
      }

      if (isAfter(new Date(), contest.to)) {
        applications = await ContestApplication.find({
          contest: contest._id,
          status: isCompanyContest ? contestApplicationStatus.pending : contestApplicationStatus.accepted,
        }).populate('student', 'firstName lastName');
      }

      res.statusCode = 200;
      res.json({
        ...contest._doc,
        applications,
        isOngoing,
      });
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * POST: /contests
   * @param {Request} req 
   * @param {Response} res 
   */
  static async saveContest(req, res) {
    try {
      let contest = new Contest(req.body);
      contest.company = req.payload.id;

      const newContest = await contest.save(req.body);

      res.statusCode = 200;
      res.json(newContest);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  // TODO: check if we need GET request for contest applications

  // TODO: add a patch request for companies application update
  /**
   * POST: /contests/:id/applications
   * @param {Request} req 
   * @param {Response} res 
   */
  static async saveContestApplication(req, res) {
    try {
      const { id: contestId } = req.params;
      const { id: studentId } = req.payload;

      const student = await Student.findById(studentId);

      let application = new ContestApplication();
      application.contest = contestId;
      application.student = student._id;
      application.coverLetter = req.body.coverLetter;
      application.biography = student.biography;

      const newApplication = application.save();

      res.statusCode = 200;
      res.json(newApplication);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }
}

const requestValidators = {
  getContests: joi.object().keys({
    status: joi.string().allow('active', 'personal'),
    filter: joi.object().keys({
      position: joi.string().allow(''),
      type: joi.array().items(
        joi.string().valid(Object.values(contestTypes)),
      ),
    }),
  }),
  getContestById: joi.object().keys({
    id: joi.string().required(),
  }),
  // TODO: check this out if necessary, and in what way
  // saveContestApplication: joi.object().keys({
  //   contestId: joi.string().uuid().required(),
  //   studentId: joi.string().uuid().required(),
  // }),
}

module.exports = ContestController;
