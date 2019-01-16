const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { contestApplicationStatus } = require('../constants');

const ContestApplicationSchema = new Schema({
  status: {
    type: String,
    enum: Object.values(contestApplicationStatus),
    default: contestApplicationStatus.pending,
  },
  contest: {
    type: Schema.Types.ObjectId,
    ref: 'Contest',
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
  biography: {
    type: Schema.Types.ObjectId,
    ref: 'Biography',
  },
  coverLetter: String,
  coverLetterPdf: String,
});

module.exports = mongoose.model('ContestApplication', ContestApplicationSchema);
