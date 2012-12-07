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
require("./vendor/jquery.frame.animation.js");

isMobile = require("./vendor/mobileCheck").isMobile();

var EditToolbar = require("./views/EditToolbar");

var TransformToolManager = require("./vendor/transform_tool");
var transformToolManager = new TransformToolManager();

$(document).ready(function(){
  $(".invisible").css({"opacity": 0});

  transformToolManager.prepare();

  require("./vendor/skrollr.min");
  require("./vendor/skrollr.mobile");
  /*require("./vendor/impress");

  var prevActiveMenu;
  var api = impress();
  api.init();*/

  $("#hut").frameAnimation({hoverMode:false, repeat:-1});

  var screens = {
    landing: 1,
    about: 0.8,
    about2: 0.7,
    about3: {ratio: 0.6, nextDelayWith: 500},
    skills: {ratio: 1, nextDelayWith: 500},
    campland: 0.9,
    members: {height: 950, offsetRatio: 0.26},
    partners: 1,
    bonus: 1
  };

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

  var screensPositions = [];

  var getScreenIndex = function(name){
    for(var i = 0;i < screensOrder.length;i ++) {
      if(screensOrder[i] == name)
        return i;
    }
  }

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
        value = $(document).height() * ratio.ratio + ratio.nextDelayWith;

      offset += value;  

      if (ratio.offsetRatio)
        screensPositions[screensOrder[i]] += value * ratio.offsetRatio;  
    }
    else
      offset += $(document).height()*ratio;
  }

  var currentScreenIndex = 0;

  var updateCurrentScreenIndex = function(top){
    for(var i = 0; i<screensOrder.length-1; i++)
      if(top  >= screens[screensOrder[i]] && top < screens[screensOrder[i+1]]) {
        currentScreenIndex = i;
        break;
      }
    toolbar.updateCurrentScreenIndex(currentScreenIndex);
  }

  var setScrollTop = function(top, options) {
    if(isMobile) {
      s.animateTo(-top, options);
    } else
      s.animateTo(top, options);
    updateCurrentScreenIndex(top);
  }

  var toolbar = new EditToolbar({
    screens: screens, 
    screensPositions: screensPositions, 
    screensOrder: screensOrder, 
    transformToolManager: transformToolManager, 
    setScrollTop: setScrollTop
  });

  s = skrollr.init({
    beforerender: function(data){
      updateCurrentScreenIndex(data.curTop);
      toolbar.updateCurTop(data.curTop);
    },
    constants: screens
  });
  
  
  var playNextScreen = function(){
    currentScreenIndex += 1;
    if(currentScreenIndex>=screensOrder.length)
      currentScreenIndex = 0;
    var top = screensPositions[screensOrder[currentScreenIndex]];
    setScrollTop(top);
  }

  var playToScreen = function(index, options){
    currentScreenIndex = index;
    var top = screensPositions[screensOrder[currentScreenIndex]];
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
      playToScreen(getScreenIndex("landing"));
    },
    showAbout: function(){
      playToScreen(getScreenIndex("about"));
    },
    showAbout2: function(){
      playToScreen(getScreenIndex("about2"));
    },
    showAbout3: function(){
      playToScreen(getScreenIndex("about3"));
    },
    showSkills: function(){
      playToScreen(getScreenIndex("skills"));
    },
    showMembers: function(){
      playToScreen(getScreenIndex("members"));
    },
    showPartners: function(){
      playToScreen(getScreenIndex("partners"));
    }
  });

  app = {
    router: new AppRouter()
  }

  window.onerror = function(err){
    alert(err);
  }
  if(isMobile)
    setTimeout(function(){
      Backbone.history.start({navigate: true}); 
    }, 300);
  else
    Backbone.history.start({navigate: true}); 

  $("#menu a").click(function(e){
    e.preventDefault();
    var self = this;
    playToScreen(getScreenIndex($(this).attr("data-screenName")), {
      done: function(){
        app.router.navigate($(self).attr("href"), false);
      }
    });
    return false;
  })

  $("body").append(toolbar.render().el);
  toolbar.render().$el.hide();
});