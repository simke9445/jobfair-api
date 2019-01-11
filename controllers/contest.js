const joi = require('joi');

const Contest = require('../models/contest');
const ContestApplication = require('../models/contestApplication');
const { validate } = require('../utils/request');
const { contestTypes } = require('../constants');
const { convertToQuery } = require('../utils/query');

const { mockContests, mockCompany, mockContestApplications, mockStudent } = require('../utils/mocks');

// TODO: test out this file, probably doesn't work

class ContestController {
  /**
   * GET: /contests
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getContests(req, res) {
    try {
      const queryParams = {
        filter: JSON.parse(req.query.filter || "{}"),
      };
      const { filter } = validate(queryParams, requestValidators.getContests);

      const contests = await Contest.find(convertToQuery(filter));

      const mock = mockContests(10);

      res.statusCode = 200
      res.json(mock);
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

      // const contest = await Contest.findById(id);

      const mock = mockContests(1)[0];
      mock.applications = mockContestApplications(20);
      mock.company = mockCompany();

      mock.applications.forEach(application => {
        application.student = mockStudent();
      });

      res.statusCode = 200;
      res.json(mock);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  // TODO: check if we need GET request for contest applications

  /**
   * POST: /contests/:id/applications
   * @param {Request} req 
   * @param {Response} res 
   */
  static async saveContestApplication(req, res) {
    try {
      // TODO: finish this
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }
}

const requestValidators = {
  getContests: joi.object().keys({
    filter: joi.object().keys({
      position: joi.string().allow(''),
      type: joi.array().items(
        joi.string().valid(Object.values(contestTypes)),
      ).allow(''),
    }),
  }),
  getContestById: joi.object().keys({
    id: joi.string().uuid().required(),
  }),
  // TODO: check this out if necessary, and in what way
  // saveContestApplication: joi.object().keys({
  //   contestId: joi.string().uuid().required(),
  //   studentId: joi.string().uuid().required(),
  // }),
}

module.exports = ContestController;
