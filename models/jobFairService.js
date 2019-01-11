const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobFairServiceSchema = new Schema({
  price: Number,
  description: String,
});

module.exports = mongoose.model('JobFairService', JobFairServiceSchema);
