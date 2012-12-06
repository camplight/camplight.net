  module.exports = Backbone.View.extend({
  template: jadeCompile(require("../templates/EditToolbar.jade.raw")),
  className: "editToolbar",
  events: {
    "click .resizeBtn": "toggleResize",
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
    this.screensPositions = options.screensPositions;
    this.screensOrder = options.screensOrder;
    this.currentScreenIndex = 0;
    this.curTop = 0;

    this.minimal = true;
    this.setScrollTop = options.setScrollTop;
    this.transformToolManager = options.transformToolManager;
    this.keyScrollEnabled = true;
    this.ctrlKey = false;

    this.selectTarget = function(e) {
        if (!self.ctrlKey) {
          self.transformToolManager.selectTarget(e.currentTarget);
          self.refreshStats();
        } else {
          $(e.currentTarget).unbind("click", self.selectTarget);
          e.currentTarget.style['pointer-events'] = "none";
          self.transformToolManager.deselectTarget();   
        }
      }

    this.transformToolManager.updateFn = function() {
      self.refreshStats();
    }

    $(window).keydown(function(e){

      if(e.ctrlKey)
        self.ctrlKey = true;

      if(e.ctrlKey && e.keyCode == 13)
        self.toggle();

      if(e.ctrlKey && e.altKey && e.keyCode == 82)
        self.toggleResize();

      if(e.ctrlKey && e.shiftKey && e.keyCode == 77)
        self.keyScrollEnabled = !self.keyScrollEnabled;

      if (!self.keyScrollEnabled && (e.keyCode == 38 || e.keyCode == 40))
      {
        e.preventDefault();
        return false;
      }
    });

    $(window).keyup(function(e){
      if(e.keyCode == 17)
        self.ctrlKey = false;
    });
  },
  updateCurrentScreenIndex: function(index){
    this.currentScreenIndex = index;
    this.refreshStats();
  },
  updateCurTop: function(data){
    this.curTop = data;
    this.refreshStats();

    if (this.transformToolManager.target)
    {
      this.transformToolManager.readTransformData();
      this.transformToolManager.updateTransform();
    }
  },
  changeCurrentScreenIndex: function(e){
    this.currentScreenIndex = $(".screensSelection option:selected").val();
    this.refreshStats();
  },
  scrollTo : function(e)
  {
    var offset = this.screensPositions[this.screensOrder[this.currentScreenIndex]];

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

    if (e)
      e.preventDefault();

    if(!this.resizable) {
      this.resizable = true;

      $(".skrollable").css('pointer-events', "");
      $(".skrollable").bind("click", this.selectTarget);
    } else {
      this.resizable = false;
      $(".skrollable").unbind("click", this.selectTarget);
      self.transformToolManager.deselectTarget();
    }
  },
  refreshStats : function()
  {
    var self = this;

    if (self.transformToolManager.target)
    {
      var screenName = self.screensOrder[self.currentScreenIndex];
      var curScreenOffset = Math.round(self.curTop-self.screens[screenName]);
      var xPos = Math.round( self.transformToolManager.target.offsetLeft);
      var yPos = Math.round( self.transformToolManager.target.offsetTop-self.screens[screenName]);

      var data = "data-_"+screenName+"-"+curScreenOffset+"="+'"top-offset:'+yPos+'px; left: '+xPos+'px; ' + self.transformToolManager.getTargetTransformInfo() + '"';

      self.$(".data").html("<input style='width: 800px' type='text' value='" + data + "'>");
    }
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