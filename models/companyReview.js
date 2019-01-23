const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanyReviewSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: { createdAt: true },
});

module.exports = mongoose.model('CompanyReview', CompanyReviewSchema);
