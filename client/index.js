jQuery = $ = require("jquery-browserify");
Backbone = require("./vendor/backbone");
require("./vendor/ga");
require("./vendor/jquery.animate-colors-min");
require("./vendor/jquery.idle-timer");
isMobile = require("./vendor/mobileCheck").isMobile();

$(document).ready(function(){
  $(".invisible").css({"opacity": 0});

  require("./vendor/skrollr.min");
  require("./vendor/skrollr.mobile");
  require("./vendor/impress");

  var prevActiveMenu;
  var api = impress();
  api.init();

  s = skrollr.init({
    beforerender: function(data){
      if(prevActiveMenu)
        prevActiveMenu.removeClass("active");
      if(data.curTop<850)
        prevActiveMenu = $("#menu a[href='#']").addClass("active");
      else
      if(data.curTop<1200) 
        prevActiveMenu = $("#menu a[href='#about']").addClass("active");
      else
      if(data.curTop<2100) 
        prevActiveMenu = $("#menu a[href='#resources']").addClass("active");
      else
      if(data.curTop<3200) 
        prevActiveMenu = $("#menu a[href='#members']").addClass("active");
      else
      if(data.curTop<3900) 
        prevActiveMenu = $("#menu a[href='#partners']").addClass("active");
      else
      if(data.curTop>7000 && data.curTop<7300) 
        prevActiveMenu = $("#menu a[href='#contacts']").addClass("active");
    },
  });

  
  var setScrollTop = function(top) {
    if(isMobile) {
      skrollr.iscroll.scrollTo(0,-top);
    } else
      s.setScrollTop(top);
  }

  var AppRouter = Backbone.Router.extend({
    routes: {
      "": "start",
      "about": "showAbout",
      "resources": "showResourcesOrSkills",
      "skills": "showResourcesOrSkills",
      "members": "showMembers",
      "partners": "showPartners",
      "contacts": "showContacts"
    },
    start: function(){
      setScrollTop(0)
    },
    showAbout: function(){
      setScrollTop(1000);
    },
    showResourcesOrSkills: function(){
      setScrollTop(1600);
    },
    showMembers: function(){
      setScrollTop(2500);
    },
    showPartners: function(){
      setScrollTop(3600);
    },
    showContacts: function(){
      setScrollTop(7300);
    }
  });

  app = {
    router: new AppRouter()
  }

  window.onerror = function(err){
    alert(err);
  }
  Backbone.history.start({navigate: true}); 

  if(isMobile) {
    $(".content").on("click", function(e){
      scrollNext();
    });
  }
    
});