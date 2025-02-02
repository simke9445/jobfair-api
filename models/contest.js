const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { addDays } = require('date-fns');

const { contestTypes } = require('../constants');

const ContestSchema = new Schema({
  position: {
    type: String,
    required: true,
  },
  from: Date,
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

ContestSchema.pre('save', function(next) {
  this.from = new Date();
  // this.from = addDays(new Date(), -3);
  next();
});

module.exports = mongoose.model('Contest', ContestSchema);
