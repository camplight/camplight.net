var fs = require("fs");
var _ = require("underscore");
var $ = require("jquery");

function trim1 (str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

var data = fs.readFileSync(__dirname+"/members.json");
var membersSorted = JSON.parse(data.toString());
membersSorted = _.sortBy(membersSorted, "name");

var data = fs.readFileSync(__dirname+"/skills.json");
var skills = JSON.parse(data.toString());

var data = fs.readFileSync(__dirname+"/partners.json");
var partners = JSON.parse(data.toString());

var rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d+))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;

var screensOrder = [
  "landing",
  "about",
  "about2",
  "about3",
  "skills",
  "campland",
  "members",
  "partners",
  "bonus"
];  

var screens = {
  landing: 1,
  about: 0.8,
  about2: 0.7,
  about3: {ratio: 0.6, nextDelayWith: 100},
  skills: {ratio: 1, nextDelayWith: 100},
  campland: 0.9,
  members: {height: 950, offsetRatio: 0.26},
  partners: 1,
  bonus: 1
}

var screensPositions = [];

var offset = 0;
var position = 0;
for(var i = 0;i < screensOrder.length;i ++) {
  var ratio = screens[screensOrder[i]];

  screens[screensOrder[i]] = offset;
  screensPositions[screensOrder[i]] = offset;

  if(typeof ratio == "object") {

    var value;

    if (ratio.height)
      value = ratio.height;  
    else
      value = 700 * ratio.ratio + ratio.nextDelayWith;

    offset += value;  

    if (ratio.offsetRatio)
      screensPositions[screensOrder[i]] += value * ratio.offsetRatio;  
  }
  else
    offset += 700*ratio;
}


var constructKeyFrame = function(attr, match, callback){
  var constant = match[1];

  //If there is a constant, get it's value or fall back to 0.
  constant = constant && screens[constant.substr(1)] || 0;

  //Parse key frame offset. If undefined will be casted to 0.
  var offset = (match[2] | 0) + constant;
  var anchor1 = match[3];
  //If second anchor is not set, the first will be taken for both.
  var anchor2 = match[4] || anchor1;

  var kf = {
    offset: offset,
    props: attr.value  
  };

  /// add support for top-offset :)
  if(kf.props.indexOf("top-offset") !== -1) {
    var parts = kf.props.split(";");
    for (var i = parts.length - 1; i >= 0; i--) {
      if(parts[i].indexOf("top-offset") !== -1) {
        parts[i] = parts[i].replace("px", "");
        parts[i] = "top: "+(parseInt(parts[i].split(":")[1])+constant)+"px"
      }
    };
    kf.props = parts.join(";");
  }

  kf.propsAsObject = function(){
    var result = {}
    var parts = kf.props.split(";");
    for (var i = parts.length - 1; i >= 0; i--) {
      var kv = parts[i].split(":");
      if(kv.length == 1 && kv[0].length == 0) continue;
      if(kv.length != 2) continue;
      result[trim1(kv[0])] = trim1(kv[1]);
    };
    return result;
  }

  callback(kf);
}

module.exports = function(chemical, callback){
  chemical.members = membersSorted;
  chemical.skills = skills;
  chemical.partners = partners;
  chemical.page = "index";
  chemical.type = "RenderPage";
  this.plasma.emit(chemical, function(response){
    var doc = $(response.data);
    var elements = doc.find("*")
    _(elements).each(function(element){
      if(!element.attributes) return;
      
      var lastKf = null;
      var _offset = 0;
      
      _(element.attributes).each(function(attr){
        var match = attr.name.match(rxKeyframeAttribute);
        if(match !== null) 
          constructKeyFrame(attr, match, function(kf){
            if(match[2] == "0") {
              lastKf = kf;
              _offset = 1000000;
            } else 
            if(kf.offset > _offset) {
              lastKf = kf;
              _offset = kf.offset;
            }
          })
      });
      if(lastKf) {
        $(element).css(lastKf.propsAsObject());
        $(element).addClass("skrollable");
      }
    });
    $(doc).find("#skrollr-body").css({
      position: "absolute",
      "z-index": "0",
      top: 0+"px",
      height: (offset-700)+"px"
    });
    response.data = doc.html();
    var code = "<script src='/js/jade.js'></script><script src='/code.js'></script>";
    response.data = response.data.split("</head>").join(code);
    callback(response);
  });
}