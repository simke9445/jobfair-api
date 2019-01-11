const joi = require('joi');
const { differenceInMonths } = require('date-fns');

const Company = require('../models/company');
const Contest = require('../models/contest');
const { bussinessAreas } = require('../constants');
const { validate } = require('../utils/request');
const { convertToQuery } = require('../utils/query');

const { mockCompanies, mockContests, mockReviews } = require('../utils/mocks');

class CompanyController {
  /**
   * GET: /company
   * @param {Request} req 
   * @param {Response} res
   */
  static async getCompanies(req, res) {
    try {
      const queryParams = {
        filter: JSON.parse(req.query.filter || "{}"),
      };
      const { filter } = validate(queryParams, requestValidators.getCompanies);

      let companies;
      // if (!req.payload || req.payload.type !== 'student') {
      //   companies = await Company.find(convertToQuery(filter))
      //                       .select("-password")
      //                       .select("-username");
      // } else {
      //   companies = await Company.find(convertToQuery(filter))
      //                       .populate('contests')
      //                       .select("-password")
      //                       .select("-username");
      // }

      const mocks = mockCompanies(10);

      res.statusCode = 200;
      res.json(mocks);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * GET: /companies/:id
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getCompanyById(req, res) {
    try {
      const { id } = validate(req.params, requestValidators.getCompanyById);

      let company;
      // if (!req.payload || req.payload.type !== 'student') {
      //   company = await Company.findById(id);
      // } else {
      //   company = await Company.findById(id)
      //                     .populate('contests');
      // }

      const mock = mockCompanies(1)[0];

      mock.contests = mockContests(10);
      mock.reviews = mockReviews(10);

      res.statusCode = 200;
      res.json(mock);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * POST: /companies/:id/reviews
   * @param {Request} req 
   * @param {Response} res 
   */
  static async saveCompanyReview(req, res) {
    try {
      // if already in company for 1 month or more, can make a review
      const { companyId, ranking, comment } = validate(req.body, requestValidators.saveCompanyReview);

      const student = Student.findById(req.payload.id)
                        .populate('biography');

      // is in company who is in the system
      const onGoingExp = student.biography.workExperiences.find(exp => exp.isOngoing);

      if (!onGoingExp) {
        return {
          message: 'No ongoing exp.',
          error: 400,
        };
      }

      if (differenceInMonths(new Date(), onGoingExp.from) < 1) {
        return {
          message: 'Not in company for at least a month',
          error: 400,
        };
      }

      const contest = new Contest({
        student: student._id,
        company: companyId,
        ranking,
        comment,
      });

      // TODO: check if we can return contest.save() instead of contest in response
      await contest.save();

      res.statusCode = 200;
      res.json(contest);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }
}

const requestValidators = {
  getCompanies: joi.object().keys({
    filter: joi.object().keys({
      name: joi.string().allow(''),
      city: joi.string().allow(''),
      bussinessArea: joi.array().items(
        joi.string().valid(Object.values(bussinessAreas)),
      ).allow(''),
    }),
  }),
  getCompanyById: joi.object().keys({
    id: joi.string().uuid().required(),
  }),
  saveCompanyReview: joi.object().keys({
    companyId: joi.string().uuid().required(),
    ranking: joi.number().min(1).max(10).required(),
    comment: joi.string().required(),
  }),
};

module.exports = CompanyController;
