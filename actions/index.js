var fs = require("fs");
var _ = require("underscore");

var data = fs.readFileSync(__dirname+"/members.json");
var membersSorted = JSON.parse(data.toString());
membersSorted = _.sortBy(membersSorted, "name");

var data = fs.readFileSync(__dirname+"/skills.json");
var skills = JSON.parse(data.toString());

var data = fs.readFileSync(__dirname+"/partners.json");
var partners = JSON.parse(data.toString());


module.exports = function(chemical, callback){
  chemical.members = membersSorted;
  chemical.skills = skills;
  chemical.partners = partners;
  callback(chemical);
}