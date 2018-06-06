var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bucketSchema = new Schema({
  uncompletedGoals: [String],
  completedGoals: [String] 
}, { minimize: false });

module.exports = bucketSchema;
