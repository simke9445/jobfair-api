const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { contestTypes } = require('../constants');

const ContestSchema = new Schema({
  position: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(contestTypes),
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
});

module.exports = mongoose.model('Contest', ContestSchema);
