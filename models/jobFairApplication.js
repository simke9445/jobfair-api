const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { jobFairApplicationStatus } = require('../constants');

const JobFairApplicationSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  fair: {
    type: Schema.Types.ObjectId,
    ref: 'JobFair',
  },
  package: {
    type: Schema.Types.ObjectId,
    ref: 'JobFairPackage',
  },
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFairService',
  }],
  status: {
    type: String,
    enum: Object.values(jobFairApplicationStatus),
    default: jobFairApplicationStatus.pending,
  },
  schedule: {
    type: Schema.Types.ObjectId,
    ref: 'JobFairSchedule',
  },
  comment: String,
});

module.exports = mongoose.model('JobFairApplication', JobFairApplicationSchema);
