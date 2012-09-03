require("ga");
$ = require("jquery-browserify");

$(document).ready(function(){
  var target = $('[effect="dropin"]');
  target.hide();
  for(var i = 0; i<target.length; i++) {
    $(target[i]).delay(i*50).fadeIn();
  }
});