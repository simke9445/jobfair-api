const joi = require('joi');

const { validate } = require('../utils/request');
const { getActivePeriodQuery, getOverlappingPeriodQuery } = require('../utils/query');
const JobFair = require('../models/jobFair');
const JobFairApplication = require('../models/jobFairApplication');
const JobFairPackage = require('../models/jobFairPackage');
const JobFairService = require('../models/jobFairService');
const jobFairSchedule = require('../models/jobFairSchedule');

class JobFairController {
  /**
   * GET: /jobfairs
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getJobFairs(req, res) {
    try {
      const { status } = validate(req.query, requestValidators.getJobFairs);

      const queryArr = [
        status === 'active' && getActivePeriodQuery('startDate', 'endDate'),
      ].filter(Boolean);

      const jobFairs = await JobFair.find({ $and: queryArr });

      res.statusCode = 200;
      res.json(jobFairs);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * GET: /jobfairs/:id
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getJobFairById(req, res) {
    try {
      const { id } = req.params;
      const { id: userId, role } = req.payload;

      const jobFair = await JobFair.findById(id);

      const queryArr = [
        { fair: jobFair._id },
        role === 'company' && getPersonalQuery('company', userId),
      ].filter(Boolean);

      const applications = await JobFairApplication.find({ $and: queryArr })
        .populate('company', 'name');

      const packages = await JobFairPackage.find({ fair: jobFair._id });
      const services = await JobFairService.find({ fair: jobFair._id });
      const schedules = await jobFairSchedule.find({ fair: jobFair._id });

      jobFair.applications = applications;
      jobFair.packages = packages;
      jobFair.services = services;
      jobFair.schedules = schedules;

      res.statusCode = 200;
      res.json(jobFair);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * POST: /jobfairs
   * @param {Request} req 
   * @param {Response} res 
   */
  static async saveJobFair(req, res) {
    try {
      const { services, packages, schedules, ...jobFairData } = req.body;

      const jobFair = new JobFair(jobFairData);

      const queryArr = [
        getActivePeriodQuery('startDate', 'endDate'),
        getOverlappingPeriodQuery('startDate', 'endDate', jobFairData.startDate, jobFair.endDate),
      ];

      const [existingJobFair] = await JobFair.find({
        $or: queryArr,
      });

      if (existingJobFair) {
        throw {
          message: 'Fair in that period already exists!',
        };
      }

      const newJobFair = await jobFair.save();
      const newPackages = await JobFairPackage.insertMany(packages.map(pkg => ({ ...pkg, fair: newJobFair._id })));
      const newServices = await JobFairService.insertMany(services.map(service => ({ ...service, fair: newJobFair._id })));
      const newSchedules = await JobFairSchedule.insertMany(schedules.map(schedule => ({ ...schedule, fair: newJobFair._id })));

      newJobFair.packages = newPackages;
      newJobFair.services = newServices;
      newJobFair.schedules = newSchedules;

      res.statusCode = 200;
      res.json(newJobFair);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * PATCH: /jobfairs/:id
   * @param {Request} req 
   * @param {Response} res 
   */
  static async updateJobFair(req, res) {
    try {
      const { biographyInterval, applicationInterval } = req.body;
      const { id } = req.params;

      const jobFair = await JobFair.findById(id);

      jobFair.biographyInterval = biographyInterval;
      jobFair.applicationInterval = applicationInterval;

      const newJobFair = await jobFair.save();

      res.statusCode = 200;
      res.json(newJobFair);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  // TODO: check if we need GET request for fair applications
  /**
   * POST: /jobfairs/:id/applications
   * @param {Request} req 
   * @param {Response} res 
   */
  static async saveJobFairApplication(req, res) {
    try {
      const { packageId, serviceIds } = req.body;
      const { id: companyId } = req.payload;
      const { id: fairId } = req.params;

      const application = new JobFairApplication();
      application.fair = fairId;
      application.company = companyId;
      application.package = packageId;
      application.services = serviceIds;

      const newApplication = await application.save();

      res.statusCode = 200;
      res.json(newApplication);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * PATCH: /jobfairs/:fairId/applications/:id
   * @param {Request} req 
   * @param {Response} res 
   */
  static async updateJobFairApplication(req, res) {
    try {
      // TODO: add schedule here
      const { status, comment } = req.body;
      const { id } = req.params;

      const application = await JobFairApplication.findById(id);
      application.status = status;
      application.comment = comment;

      const newApplication = await application.save();

      res.statusCode = 200;
      res.json(newApplication);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }
}

const requestValidators = {
  getJobFairs: joi.object().keys({
    status: joi.string().required().allow('active'),
  }),
}

module.exports = JobFairController;
