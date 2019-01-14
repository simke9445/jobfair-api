const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobFairInterval = new Schema({
  from: {
    type: String,
    required: true,
    default: '09:00:00',
  },
  to: {
    type: String,
    required: true,
    default: '17:00:00',
  },
});

const JobFairSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
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
  biographyInterval: JobFairInterval,
  applicationInterval: JobFairInterval,
});

module.exports = mongoose.model('JobFair', JobFairSchema);
