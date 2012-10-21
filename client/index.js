jQuery = $ = require("jquery-browserify");
Backbone = require("./vendor/backbone");
require("./vendor/ga");
require("./vendor/jquery.animate-colors-min");
require("./vendor/jquery.idle-timer");


$(document).ready(function(){
  $(".invisible").css({"opacity": 0});
  require("./vendor/skrollr.min.js");
  require("./vendor/skrollr.mobile");
  var prevActiveMenu;

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
      if(data.curTop>7000) 
        prevActiveMenu = $("#menu a[href='#contacts']").addClass("active");
    }
  });

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
      s.setScrollTop(0)
    },
    showAbout: function(){
      s.setScrollTop(1000);
    },
    showResourcesOrSkills: function(){
      s.setScrollTop(1600);
    },
    showMembers: function(){
      s.setScrollTop(2500);
    },
    showPartners: function(){
      s.setScrollTop(3600);
    },
    showContacts: function(){
      s.setScrollTop(7300);
    }
  });

  app = {
    router: new AppRouter()
  }
  Backbone.history.start({navigate: true}); 
});