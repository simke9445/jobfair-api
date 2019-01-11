const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { jobFairAreaStatus } = require('../constants');

const JobFairAreaScheme = new Schema({
  location: String,
  status: {
    type: String,
    enum: Object.values(jobFairAreaStatus),
    default: jobFairAreaStatus.free,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  fair: {
    type: Schema.Types.ObjectId,
    ref: 'JobFair',
  },
});

module.exports = mongoose.model('JobFairArea', JobFairAreaScheme);
