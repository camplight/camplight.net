var fs = require("fs");
module.exports = function(chemical, config, callback){
  fs.readFile(__dirname+"/members.json", function(err, data){
    if(err)
      throw err;
    chemical.data.members = JSON.parse(data.toString());
    callback();
  });
}