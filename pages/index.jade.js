require("../client/vendor/jquery");

isMobile = require("../client/vendor/mobileCheck").isMobile();


$(document).ready(function(){
  require("../client/vendor/jquery/jquery.mousewheel.js");
  require("../client/vendor/jquery/jquery.simplr.smoothscroll.js");
  var platform = navigator.platform.toLowerCase();
  if (platform.indexOf('windows') != -1 || platform.indexOf('linux') != -1) {
    if ($.browser.webkit) {
      $.srSmoothscroll();
    }
  }

  $(".invisible").css({"opacity": 0});

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
    contacts: 1
  };

  var screensOrder = [
    "landing",
    "about",
    "about2",
    "about3",
    "skills",
    "campland",
    "members",
    "contacts"
  ];  

  var screensPlaybackDelays = {
    landing: 7500,
    about: 7500,
    about2: 7500,
    about3: 9500,
    skills: 2500,
    campland: 9500,
    members: 10500,
    contacts: 10500
  }

  var screensPositions = [];

  var currentScreenIndex = 0;
  var playing = null;
  var updateId = null;

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
    for(var i = 0; i<screensOrder.length-1; i++) {
      if(top  >= Math.floor(screensPositions[screensOrder[i]]) && top < Math.floor(screensPositions[screensOrder[i+1]])) {
        return i;
      }
    }
    return i;
  }

  var updateActiveMenuAndUrl = function(top){
    if(top) {
      var index = getCurrentScreenIndex(top);
      if(index == currentScreenIndex) return;
      currentScreenIndex = index;
    }
    $("#menu a").removeClass("active");
    var name = getScreenName(currentScreenIndex);
    var selector = "a[href='#"+name+"']";
    $(selector).addClass("active");
    app.router.navigate(name, false);
  }

  var toolbar;

  Backbone = require("../client/vendor/backbone");

  if(require("env").CELL_MODE == "development") {
    var EditToolbar = require("../client/views/EditToolbar");

    var TransformToolManager = require("../client/vendor/transform_tool");
    var transformToolManager = new TransformToolManager();
    transformToolManager.prepare();

    toolbar = new EditToolbar({
      screens: screens, 
      screensPositions: screensPositions, 
      screensOrder: screensOrder, 
      transformToolManager: transformToolManager, 
      setScrollTop: setScrollTop
    });
  }

  calculateScreensAsConstants();
  var s = skrollr.init({
    beforerender: function(data){
      if(toolbar)
        toolbar.updateCurTop(data.curTop);
    },
    render: function(data){
      if(playing) return;
      if(updateId) clearTimeout(updateId);
      updateId = setTimeout(function(){
        updateActiveMenuAndUrl(data.curTop);
      }, 500);
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
    if(toolbar)
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
    showContacts: function(){
      playToScreen(getScreenIndex("contacts"));
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

  $(".member").mouseover(function(e){
    e.preventDefault();
    var offset = $(this).position();
    var w = $(this).width();
    var h = $(this).height();
    $(".tooltip .title").html($(this).attr("data-title"));
    var tw = $(".tooltip").width();
    var th = $(".tooltip").height();
    $(".tooltip")
      .css('top', (offset.top-th)+"px")
      .css('left', (offset.left+w/2-tw/2)+"px")
      .stop(true, true)
      .fadeIn();
  }).mouseout(function(e){
    $(".tooltip")
      .stop(true, true)
      .fadeOut();
  }).attr("title", "");

  $(".contactBtn").mouseover(function(e){
    e.preventDefault();
    $(this).stop(true, true).transition({ scale: 1.2 });
  }).mouseout(function(e){
    $(this).stop(true, true).transition({ scale: 1 });
  });

  if(toolbar) {
    $("body").append(toolbar.render().el);
    toolbar.render().$el.hide();
  }

  $(document).keydown(function(e) { 
    if(e.which == 33        // page up 
       || e.which == 34     // page dn 
       || e.which == 32     // spacebar
       || e.which == 38     // up 
       || e.which == 40     // down 
       || (e.ctrlKey && e.which == 36)     // ctrl + home 
       || (e.ctrlKey && e.which == 35)     // ctrl + end 
      ) { 
        if(playing)
          stopPlayAll();
      } 
  }); 

  var  mouseEvent = function(e) {
    if(playing)
      stopPlayAll();
  } 
  
  var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
  $(window).bind(mousewheelevt, function(e){

      var evt = window.event || e //equalize event object     
      evt = evt.originalEvent ? evt.originalEvent : evt; //convert to originalEvent if possible               
      mouseEvent(evt);
  });
  
});