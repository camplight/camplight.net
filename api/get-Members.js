var fs = require("fs");
var _ = require("underscore");

var data = fs.readFileSync(__dirname+"/members.json");
var membersSorted = JSON.parse(data.toString());
membersSorted = _.sortBy(membersSorted, "name");

module.exports = function(chemical, callback){
  chemical.data = _.extend(chemical.data || {}, { members : membersSorted});
  callback();
}