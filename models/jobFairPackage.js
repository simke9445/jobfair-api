const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobFairPackageSchema = new Schema({
  fair: {
    type: Schema.Types.ObjectId,
    ref: 'JobFair',
  },
  title: String,
  videoPromotion: Number,
  numOfLessons: Number,
  numOfWorkshops: Number,
  numOfPresentations: Number,
  totalNumOfCompanies: Number,
  content: [String],
  price: Number,
});

module.exports = mongoose.model('JobFairPackage', JobFairPackageSchema);
