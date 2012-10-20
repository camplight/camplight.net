require("./vendor/ga");
jQuery = $ = require("jquery-browserify");
require("./vendor/jquery.animate-colors-min");
require("./vendor/jquery.idle-timer");

$(document).ready(function(){
  $(".invisible").css({"opacity": 0});
  require("./vendor/skrollr.min.js");
  require("./vendor/skrollr.mobile");
  skrollr.init({
    render: function(data){
      //console.log(data);
    }
  });
});