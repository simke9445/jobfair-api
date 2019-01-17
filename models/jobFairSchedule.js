const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { jobFairScheduleType } = require('../constants');

const JobFairScheduleSchema = new Schema({
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(jobFairScheduleType),
    default: jobFairScheduleType.lesson,
  },
  application: {
    type: Schema.Types.ObjectId,
    ref: 'JobFairApplication',
  },
  fair: {
    type: Schema.Types.ObjectId,
    ref: 'JobFair',
  },
});

module.exports = mongoose.model('JobFairSchedule', JobFairScheduleSchema);
