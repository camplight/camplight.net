require("../client/vendor/jquery");

jadeCompile = function(path){
  var compiled = jade.compile(path);
  return function(data) {
    data = data || {};
    data.t = $.t;
    return compiled(data);
  }
};

Backbone = require("../client/vendor/backbone");
require("../client/vendor/ga");

isMobile = require("../client/vendor/mobileCheck").isMobile();

var EditToolbar = require("../client/views/EditToolbar");

var TransformToolManager = require("../client/vendor/transform_tool");
var transformToolManager = new TransformToolManager();

$(document).ready(function(){
  $(".invisible").css({"opacity": 0});

  transformToolManager.prepare();

  require("../client/vendor/skrollr.min");
  require("../client/vendor/skrollr.mobile");

  $("#hut").frameAnimation({hoverMode:false, repeat:-1});
  $("#owl").frameAnimation({hoverMode:false, repeat:-1});
  $("#moon").frameAnimation({hoverMode:false, repeat:-1});

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

  var screensPlaybackDelays = {
    landing: 2500,
    about: 3500,
    about2: 3500,
    about3: 3500,
    skills: 4500,
    campland: 5500,
    members: 5500,
    partners: 3500,
    bonus: 1200
  }

  var screensPositions = [];

  var currentScreenIndex = 0;
  var playing = null;

  var getScreenIndex = function(name){
    for(var i = 0;i < screensOrder.length;i ++) {
      if(screensOrder[i] == name)
        return i;
    }
  }

  var getScreenName = function(currentScreenIndex) {
    return screensOrder[currentScreenIndex];
  }

  var calculateScreensAsConstants = function() {
    var offset = 0;
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
  }

  var setScrollTop = function(top, options) {
    if(isMobile) {
      s.animateTo(-top, options);
    } else
      s.animateTo(top, options);
  }

  var getCurrentScreenIndex = function(top) {
    for(var i = 0; i<screensOrder.length-1; i++)
      if(top  >= screensPositions[screensOrder[i]] && top < screensPositions[screensOrder[i+1]]) {
        return i;
      }
    return i;
  }

  var updateActiveMenuAndUrl = function(){
    $("#menu a").removeClass("active");
    var name = getScreenName(currentScreenIndex);
    var selector = "a[href='#"+name+"']";
    $(selector).addClass("active");
    app.router.navigate(name, false);
  }

  var toolbar = new EditToolbar({
    screens: screens, 
    screensPositions: screensPositions, 
    screensOrder: screensOrder, 
    transformToolManager: transformToolManager, 
    setScrollTop: setScrollTop
  });

  calculateScreensAsConstants();
  var s = skrollr.init({
    beforerender: function(data){
      toolbar.updateCurTop(data.curTop);
    },
    constants: screens
  });
  
  var playNextScreen = function(options){
    currentScreenIndex += 1;
    if(currentScreenIndex>=screensOrder.length)
      currentScreenIndex = 0;
    playToScreen(currentScreenIndex, options);
  }

  var playToScreen = function(index, options){
    currentScreenIndex = index;
    var top = screensPositions[screensOrder[currentScreenIndex]];

    options = options || {};
    var done = options.done;
    options.done = function(){
      updateActiveMenuAndUrl();
      if(done)done();
    }

    setScrollTop(top, options); 
    toolbar.updateCurrentScreenIndex(currentScreenIndex);
  }

  var stopPlayAll = function(){
    if(playing === true)
      s.stopAnimateTo();
    else
      clearTimeout(playing);
    playing = null;
    $(".playBtn").text("Play");
  }

  var togglePlayAll = function(){
    if(playing) {
      stopPlayAll();
    } else {
      playing = true;
      var playNextWithDelay = function(delay){
        updateActiveMenuAndUrl();
        playing = setTimeout(function(){
          playNextScreen({
            done: playNextWithDelay(screensPlaybackDelays[getScreenName(currentScreenIndex)])
          })
        }, delay);
        }
      playNextScreen({
        done: playNextWithDelay(screensPlaybackDelays[getScreenName(currentScreenIndex)])
      });
    }
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
    if(!$(this).attr("data-screenName")) return;
    stopPlayAll();
    playToScreen(getScreenIndex($(this).attr("data-screenName")));
    return false;
  });

  $(".playBtn").text("Play").click(function(e){
    e.preventDefault();
    togglePlayAll();
    if(playing)
      $(this).text("Stop");
    else
      $(this).text("Play");
    return false;
  })

  $("a.anchor").remove();

  $("body").append(toolbar.render().el);
  toolbar.render().$el.hide();
});