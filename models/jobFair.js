const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobFairInterval = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
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
  areas: [String],
  booths: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFairBooth',
  }],
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFairApplication',
  }],
  schedules: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFairSchedule',
  }],
  biographyInterval: JobFairInterval,
  applicationInterval: JobFairInterval,
});

module.exports = mongoose.model('JobFair', JobFairSchema);
