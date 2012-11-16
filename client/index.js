require("./vendor/jquery");
jadeCompile = function(path){
  var compiled = jade.compile(path);
  return function(data) {
    data = data || {};
    data.t = $.t;
    return compiled(data);
  }
};


Backbone = require("./vendor/backbone");
require("./vendor/ga");
require("./vendor/jquery.animate-colors-min");
require("./vendor/jquery.idle-timer");
isMobile = require("./vendor/mobileCheck").isMobile();

var EditToolbar = require("./views/EditToolbar");

$(document).ready(function(){
  $(".invisible").css({"opacity": 0});

  

  require("./vendor/skrollr.min");
  require("./vendor/skrollr.mobile");
  /*require("./vendor/impress");

  var prevActiveMenu;
  var api = impress();
  api.init();*/

  var screens = {
    landing: 1,
    about: 0.8,
    about2: 0.7,
    about3: {ratio: 0.6, nextDelayWith: 500},
    skills: {ratio: 1, nextDelayWith: 500},
    members: 1,
    partners: 1,
    bonus: 1
  };

  var screensOrder = [
    "landing",
    "about",
    "about2",
    "about3",
    "skills",
    "members",
    "partners",
    "bonus"
  ];  

  var offset = 0;
  for(var i = 0;i < screensOrder.length;i ++) {
    var ratio = screens[screensOrder[i]];
    screens[screensOrder[i]] = offset;
    if(typeof ratio == "object")
      offset += $(document).height()*ratio.ratio+ratio.nextDelayWith;  
    else
      offset += $(document).height()*ratio;
  }
  console.log(screens);

  var currentScreenIndex = 0;

  var updateCurrentScreenIndex = function(top){
    for(var i = 0; i<screensOrder.length-1; i++)
      if(top  >= screens[screensOrder[i]] && top < screens[screensOrder[i+1]]) {
        currentScreenIndex = i;
        break;
      }
    toolbar.updateCurrentScreenIndex(currentScreenIndex);
  }

  var toolbar = new EditToolbar({screens: screens, screensOrder: screensOrder});

  s = skrollr.init({
    beforerender: function(data){
      console.log(data.curTop);
      updateCurrentScreenIndex(data.curTop);
      toolbar.updateCurTop(data.curTop);
    },
    constants: screens
  });
  
  var setScrollTop = function(top, options) {
    if(isMobile) {
      skrollr.iscroll.scrollTo(0,-top);
    } else
      s.animateTo(top, options);
    updateCurrentScreenIndex(top);
  }

  
  var playNextScreen = function(){
    currentScreenIndex += 1;
    if(currentScreenIndex>=screensOrder.length)
      currentScreenIndex = 0;
    var top = screens[screensOrder[currentScreenIndex]];
    setScrollTop(top);
  }

  var playToScreen = function(index, options){
    currentScreenIndex = index;
    var top = screens[screensOrder[currentScreenIndex]];
    setScrollTop(top, options); 
  }

  var AppRouter = Backbone.Router.extend({
    routes: {
      "": "start",
      "about": "showAbout",
      "about2": "showAbout2",
      "about3": "showAbout3",
      "skills": "showSkills",
      "members": "showMembers",
      "partners": "showPartners",
      "contacts": "showContacts"
    },
    start: function(){
      playToScreen(0);
    },
    showAbout: function(){
      playToScreen(1);
    },
    showAbout2: function(){
      playToScreen(2);
    },
    showAbout3: function(){
      playToScreen(3);
    },
    showSkills: function(){
      playToScreen(4);
    },
    showMembers: function(){
      playToScreen(5);
    },
    showPartners: function(){
      playToScreen(6);
    }
  });

  app = {
    router: new AppRouter()
  }

  window.onerror = function(err){
    alert(err);
  }
  Backbone.history.start({navigate: true}); 

  $("#menu a").click(function(e){
    e.preventDefault();
    var self = this;
    playToScreen($(this).attr("data-screenIndex"), {
      done: function(){
        app.router.navigate($(self).attr("href"), false);
      }
    });
    return false;
  })

  $(window).mousedown(function(e){
    if(e.ctrlKey) {
      e.preventDefault();
      playNextScreen();
    }
  });

  
  $("body").append(toolbar.render().el);
  toolbar.render().$el.hide();
});