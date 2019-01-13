const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { jobFairBoothStatus } = require('../constants');

const JobFairBoothSchema = new Schema({
  location: String,
  status: {
    type: String,
    enum: Object.values(jobFairBoothStatus),
    default: jobFairBoothStatus.free,
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

module.exports = mongoose.model('JobFairBooth', JobFairBoothSchema);
