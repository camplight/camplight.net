var fs = require("fs");
var _ = require("underscore");

var data = fs.readFileSync(__dirname+"/../data/members.json");
var membersSorted = JSON.parse(data.toString());
membersSorted = _.sortBy(membersSorted, "name");

var data = fs.readFileSync(__dirname+"/../data/skills.json");
var skills = JSON.parse(data.toString());

var data = fs.readFileSync(__dirname+"/../data/partners.json");
var partners = JSON.parse(data.toString());

module.exports = function(config){
  var self = this;

  return {
    "GET": function(req, res) {
      var chemical = {};
      chemical.members = membersSorted;
      chemical.skills = skills;
      chemical.partners = partners;
      res.renderPage(chemical, function(response){

        // find all elements which are dynamic and apply to them css styles to be arranged properly
        // without javascript support
        response.data = self.site.freezeDynamicElementsPositionCSS(response.data);

        // detect incoming browser type
        var browser = self.browser.detect(req);

        // append script elements into head for browsers with dynamic support
        if(!req.query.noscript && !browser.Mobile && !browser.iPhone && !browser.iPad && !browser.Android ) {
          var sources = ["/js/jade.js", "/code.js", "/js/social-sdks.js", "/js/ga.js"];
          var code = "<script src='"+sources.join("'></script><script src='")+"'></script>";
          response.data = response.data.split("</head>").join(code);
        } else {
          var sources = ["/js/social-sdks.js", "/js/ga.js"];
          var code = "<script src='"+sources.join("'></script><script src='")+"'></script>";
          response.data = response.data.split("</head>").join(code);
        }

        // send modified page data to browser
        res.send(response.data);
      });
    }
  }
}