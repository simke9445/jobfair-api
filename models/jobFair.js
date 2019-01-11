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
});

const JobFairSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  packages: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFairPackage',
  }],
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFairService'
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  logoImage: {
    type: String,
    data: Buffer
  }, // work with images later
  images: [{
    type: String,
    data: Buffer
  }],
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  areas: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFairArea',
  }],
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFairApplication',
  }],
  schedules: [JobFairScheduleSchema],
});

module.exports = mongoose.model('JobFair', JobFairSchema);
