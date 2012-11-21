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

var TransformToolManager = require("./vendor/transform_tool");
var transformToolManager = new TransformToolManager();

console.log(transformToolManager);

$(document).ready(function(){
  $(".invisible").css({"opacity": 0});

  transformToolManager.prepare();

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
    campland: 0.9,
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
    "campland",
    "members",
    "partners",
    "bonus"
  ];  

  var getScreenIndex = function(name){
    for(var i = 0;i < screensOrder.length;i ++) {
      if(screensOrder[i] == name)
        return i;
    }
  }

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

  var setScrollTop = function(top, options) {
    if(isMobile) {
      skrollr.iscroll.scrollTo(0,-top);
    } else
      s.animateTo(top, options);
    updateCurrentScreenIndex(top);
  }

  var toolbar = new EditToolbar({screens: screens, screensOrder: screensOrder, transformToolManager: transformToolManager, setScrollTop: setScrollTop});

  s = skrollr.init({
    beforerender: function(data){
      console.log(data.curTop);
      updateCurrentScreenIndex(data.curTop);
      toolbar.updateCurTop(data.curTop);
    },
    constants: screens
  });
  
  
  var playNextScreen = function(){
    currentScreenIndex += 1;
    if(currentScreenIndex>=screensOrder.length)
      currentScreenIndex = 0;
    var top = screens[screensOrder[currentScreenIndex]];
    setScrollTop(top);
  }

  var fireLoopId;
  var startFireAnimation = function(){
    var speed = 3000;
    var loopDir = true;
    var func = function(){
      if(loopDir) {
        $(".fire").transition({
          scale: [0.45,0.45],
          y: "-15px"
        }, speed);
      } else {
        $(".fire").transition({
          scale: [0.4,0.4],
          y: "15px"
        }, speed);
      }
      loopDir = !loopDir;
    };
    func();
    setInterval(func, speed);
  }

  var stopFireAnimation = function(){
    if(fireLoopId) {
      clearInterval(fireLoopId);
      fireLoopId = undefined;
    }
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

  $(".member").mouseover(function(e){
    e.preventDefault();
    $(this).transition({
      scale: [1.2, 1.2]
    });
  });
  $(".member").mouseout(function(e){
    e.preventDefault();
    $(this).transition({
      scale: [1, 1]
    });
  });

  $(".member").betterTooltip({speed: 150, delay: 100});
  startFireAnimation();

  $(window).mousedown(function(e){
    if(e.ctrlKey) {
      e.preventDefault();
      playNextScreen();
    }
  });

  
  $("body").append(toolbar.render().el);
  toolbar.render().$el.hide();
});