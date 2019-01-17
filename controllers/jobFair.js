const joi = require('joi');

const { validate } = require('../utils/request');
const { getActivePeriodQuery, getOverlappingPeriodQuery, getPersonalQuery } = require('../utils/query');
const { isTimeWithinRange } = require('../utils/date');
const JobFair = require('../models/jobFair');
const JobFairApplication = require('../models/jobFairApplication');
const JobFairPackage = require('../models/jobFairPackage');
const JobFairService = require('../models/jobFairService');
const JobFairSchedule = require('../models/jobFairSchedule');

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

      let applications = await JobFairApplication.find({ $and: queryArr })
        .populate('company', 'name')
        .populate('services')
        .populate('package');

      const applicationSchedules = await Promise.all(
        applications.map(
          x => JobFairSchedule.find({ application: x._id, fair: jobFair._id })
            .exec(),
        ),
      );
      applications = applications.map((application, i) => ({ ...application._doc, schedules: applicationSchedules[i] }));

      let applyAllowed = jobFair.applicationInterval &&
        isTimeWithinRange(new Date(), jobFair.applicationInterval.from, jobFair.applicationInterval.to);

      const packages = await JobFairPackage.find({ fair: jobFair._id });
      const services = await JobFairService.find({ fair: jobFair._id });
      const schedules = await JobFairSchedule.find({ fair: jobFair._id, application: undefined });

      jobFair.applications = applications;
      jobFair.packages = packages;
      jobFair.services = services;
      jobFair.schedules = schedules;

      res.statusCode = 200;
      res.json({
        ...jobFair._doc,
        applications,
        schedules,
        services,
        packages,
        applyAllowed,
      });
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
   * POST /jobfairs/:id/images
   * @param {Request} req 
   * @param {Response} res 
   */
  static async uploadJobFairImages(req, res) {
    try {
      const { id } = req.params;
      const logoImage = req.file.path;

      const jobFair = await JobFair.findById(id);
      jobFair.logoImage = logoImage;

      const newJobFair = await jobFair.save();

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

      jobFair.biographyInterval = biographyInterval || jobFair.biographyInterval;
      jobFair.applicationInterval = applicationInterval || jobFair.applicationInterval;

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
      const { status, comment, schedules } = req.body;
      const { id } = req.params;

      const application = await JobFairApplication.findById(id);
      application.status = status;
      application.comment = comment || application.comment;

      const prevSchedules = await JobFairSchedule.find({ application: application._id });

      await Promise.all(prevSchedules.map(async schedule => {
        schedule.application = null;
        return schedule.save();
      }));

      const currentSchedules = await JobFairSchedule.find()
        .where('_id')
        .in(schedules);

      await Promise.all(currentSchedules.map(async schedule => {
        schedule.application = application._id;
        return schedule.save();
      }));

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
