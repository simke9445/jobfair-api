const joi = require('joi');
const { differenceInMonths } = require('date-fns');

const Company = require('../models/company');
const Contest = require('../models/contest');
const Student = require('../models/student');
const CompanyReview = require('../models/companyReview');
const { bussinessAreas } = require('../constants');
const { validate } = require('../utils/request');
const { convertToQuery, getActivePeriodQuery } = require('../utils/query');

const isReviewAllowed = (company, student) => {
  const onGoingExp =
    student.biography && student.biography.workExperiences &&
    student.biography.workExperiences.find(exp => exp.isOngoing);

  return onGoingExp && differenceInMonths(new Date(), onGoingExp.from) >= 1 && company.name === onGoingExp.organisationName;
};

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

      const companies = await Company.find(convertToQuery(filter))
        .select("-password")
        .select("-username");

      res.statusCode = 200;
      res.json(companies);
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

      const company = await Company.findById(id)
        .select('-username')
        .select('-password');

      const reviews = await CompanyReview.find({ company: company._id });
      const contests = await Contest.find({
        $and: [{ company: company._id }, getActivePeriodQuery('from', 'to')],
      });

      let reviewAllowed = false;

      if (req.payload && req.payload.role === 'student') {
        const student = await Student.findById(req.payload.id)
          .populate('biography');

        reviewAllowed = isReviewAllowed(company, student);
      }

      res.statusCode = 200;
      // TODO: check if we may do desctructuring like this
      res.json({
        ...company._doc,
        reviews,
        contests,
        reviewAllowed,
      });
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
      const { id, rating, comment } = validate({ ...req.body, ...req.params }, requestValidators.saveCompanyReview);

      const student = await Student.findById(req.payload.id)
        .populate('biography');

      const company = await Company.findById(id);
      const reviewAllowed = isReviewAllowed(company, student);

      if (!reviewAllowed) {
        return {
          message: 'Not in company currently for at least a month',
          error: 400,
        };
      }

      const companyReview = new CompanyReview({
        student: student._id,
        company: id,
        rating,
        comment,
      });

      const newReview = await companyReview.save();

      res.statusCode = 200;
      res.json(newReview);
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
      ),
    }),
  }),
  getCompanyById: joi.object().keys({
    id: joi.string().required(),
  }),
  saveCompanyReview: joi.object().keys({
    id: joi.string().required(),
    rating: joi.number().min(1).max(10).required(),
    comment: joi.string().required(),
  }),
};

module.exports = CompanyController;
