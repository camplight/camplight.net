require("./vendor/ga");
jQuery = $ = require("jquery-browserify");
require("./vendor/jquery.animate-colors-min");
require("./vendor/jquery.idle-timer");
require("./vendor/skrollr.mobile");

$(document).ready(function(){
  $(".invisible").css({"opacity": 0});
  require("./vendor/skrollr.min.js");
  skrollr.init({
    forceHeight: true,
    render: function(data){
      console.log(data);
    }
  });
});