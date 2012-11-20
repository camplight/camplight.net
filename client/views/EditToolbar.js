  module.exports = Backbone.View.extend({
  template: jadeCompile(require("../templates/EditToolbar.jade.raw")),
  className: "editToolbar",
  events: {
    "click .resizeBtn": "toggleResize",
    "click .dragBtn": "toggleDrag",
    "click .moveUp": "moveUp",
    "click .moveDown": "moveDown",
    "click .resetBtn": "reset",
    "click .moveLeft": "moveLeft",
    "click .moveRight": "moveRight",
    "change .screensSelection": "changeCurrentScreenIndex",
    "click .scrollTo": "scrollTo",
    "click .deselectTarget": "deselectTarget"
  },
  initialize: function(options){
    var self = this;

    this.screens = options.screens;
    this.screensOrder = options.screensOrder;
    this.currentScreenIndex = 0;
    this.curTop = 0;

    this.minimal = true;
    this.setScrollTop = options.setScrollTop;
    this.transformToolManager = options.transformToolManager;

    $(window).keydown(function(e){
      if(e.ctrlKey && e.keyCode == 13)
        self.toggle();
    });

   /* this.resizable = true;
    $(".skrollable").mousedown(function(e) {
      console.log(e.currentTarget);
      self.transformToolManager.selectTarget(e.currentTarget);
    });*/
  },
  updateCurrentScreenIndex: function(index){
    this.currentScreenIndex = index;
    var self = this;
    var screenName = self.screensOrder[self.currentScreenIndex];
    var curOffset = self.curTop-self.screens[self.screensOrder[self.currentScreenIndex]];
    var data = "data-_"+screenName+"-"+curOffset+"=";
    self.$(".data").html(data);
  },
  updateCurTop: function(data){
    this.curTop = data;
  },
  changeCurrentScreenIndex: function(e){
    this.currentScreenIndex = $(".screensSelection option:selected").val();
    var self = this;
    var screenName = self.screensOrder[self.currentScreenIndex];
    var curOffset = self.curTop-self.screens[self.screensOrder[self.currentScreenIndex]];
    var data = "data-_"+screenName+"-"+curOffset+"=";
    self.$(".data").html(data);
  },
  scrollTo : function(e)
  {
    var offset = this.screens[this.screensOrder[this.currentScreenIndex]];

    this.setScrollTop(offset);
  },
  toggle: function(e){
    if(e) e.preventDefault();
    if(!this.minimal) {
      this.minimal = true;
      this.$el.hide();
    } else  {
      this.minimal = false;
      this.$el.show();
    }
  },
  toggleResize : function(e){
    var self = this;

    e.preventDefault();
    if(!this.resizable) {
      this.resizable = true;
      /*$(".skrollable").css({
        border: "1px solid red"
      }).resizable();*/
      $(".skrollable").mousedown(function(e) {
        console.log(e.currentTarget);
        self.transformToolManager.selectTarget(e.currentTarget);
      });
    } else {
      this.resizable = false;
      $(".skrollable").mousedown(function(e) {});
      self.transformToolManager.deselectTarget();
      //$(".skrollable").resizable( "destroy" ).css({border: ""});
    }
  },
  refreshStats : function()
  {
    var self = this;
    var screenName = self.screensOrder[self.currentScreenIndex];
    var curScreenOffset = Math.round(self.curTop-self.screens[screenName]);
    var xPos = Math.round( self.transformToolManager.target.offsetLeft);
    var yPos = Math.round( self.transformToolManager.target.offsetTop-self.screens[screenName]);

    var data = "data-_"+screenName+"-"+curScreenOffset+"="+'"top-offset:'+yPos+'px; left: '+xPos+'px; ' + self.transformToolManager.getTargetTransformInfo() + '"';

    console.log(xPos, yPos, data);

    self.$(".data").html(data);
  },
  toggleDrag : function(e){
    e.preventDefault();
    this.refreshStats();



    /*var self = this;
    if(!this.draggable) {
      this.draggable = true;
      $(".skrollable").css({
        border: "1px solid red"
      }).draggable({
        drag: function(){
          var screenName = self.screensOrder[self.currentScreenIndex];
          var curScreenOffset = Math.round(self.curTop-self.screens[screenName]);
          var xPos = Math.round($(this).position().left);
          var yPos = Math.round($(this).position().top-self.screens[screenName]);
          console.log($(this).position().top, curScreenOffset, self.screens[screenName]);

          var data = "data-_"+screenName+"-"+curScreenOffset+"="+'"top-offset:'+yPos+'px; left: '+xPos+'px;';
          self.$(".data").html(data);
        }
      });
    } else {
      this.draggable = false;
      $(".skrollable").draggable( "destroy" ).css({border: ""});
    }*/
  },
  deselectTarget: function()
  {
      this.transformToolManager.deselectTarget();
  },
  moveUp: function(){
    if(!this.oldPosition)
      this.oldPosition = $("#skrollr-body").position();
    var p = $("#skrollr-body").position();
    p.top += 100;
    $("#skrollr-body").offset(p);
  },
  moveDown: function(){
    if(!this.oldPosition)
      this.oldPosition = $("#skrollr-body").position();
    var p = $("#skrollr-body").position();
    p.top -= 100;
    $("#skrollr-body").offset(p);
  },
  moveLeft: function(){
    if(!this.oldPosition)
      this.oldPosition = $("#skrollr-body").position();
    var p = $("#skrollr-body").position();
    p.left += 100;
    $("#skrollr-body").offset(p);
  },
  moveRight: function(){
    if(!this.oldPosition)
      this.oldPosition = $("#skrollr-body").position();
    var p = $("#skrollr-body").position();
    p.left -= 100;
    $("#skrollr-body").offset(p);
  },
  reset: function(){
    $("#skrollr-body").offset(this.oldPosition);
    this.oldPosition = undefined;
  },
  render: function(){
    this.$el.html(this.template());
    for (var i =  0; i < this.screensOrder.length; i++) {
      var screenName = this.screensOrder[i];
      this.$(".screensSelection").append("<option value='"+i+"'>"+screenName+"</option>");
    };
    return this;
  }
});