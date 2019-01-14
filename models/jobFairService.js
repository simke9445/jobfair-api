const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobFairServiceSchema = new Schema({
  price: Number,
  description: String,
  fair: {
    type: Schema.Types.ObjectId,
    ref: 'JobFair',
  },
});

module.exports = mongoose.model('JobFairService', JobFairServiceSchema);
