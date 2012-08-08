var Routes = Backbone.Router.extend({
  routes: {
    "": "showIndex",
    "about": "showAbout"
  },

  showIndex: function(){
    console.log("SHOWING INDEX");
    $("#content").animate({
      height: "0px",
      opacity: "0"
    }, function(){
      $.get("/?contentOnly=true")
        .success(function(data){
          $("#content").html(data);

          $("#content").css({
            height: '',
            opacity: ''
          });

          $("#skills").css({
            height: "0px"
          }).show().animate({
            height: "300px"
          }, 600);

          $("#team").css({
            height: "0px"
          }).delay(600).show().animate({
            height: "300px"
          }, 600);

        });
    });
  },

  showAbout: function(){
    console.log("SHOWING ABOUT");
    $("#content").animate({
      height: "0px",
      opacity: "0"
    }, function(){
      $.get("/about?contentOnly=true")
        .success(function(data){
          $("#content").html(data).animate({
            height: "500px",
            opacity: "1"
          });
        });
    });
  }
});
var routes = new Routes();

$("#menu a").click(function(e){
  var path = $(e.currentTarget).attr("href").replace("/","");
  routes.navigate(path, {trigger: true});
  console.log("navigated to "+path);
  return false;
});

module.exports = routes;