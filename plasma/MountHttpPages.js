var util = require("util");
var Organel = require("organic").Organel;
var glob = require('glob');
var path = require("path");
var _ = require("underscore");
var fs = require("fs");

module.exports = function HttpPages(plasma, config){
  Organel.call(this, plasma);

  this.config = config;
  this.started = new Date((new Date()).toUTCString());

  // bootstrap all actions once httpserver is ready
  this.on("HttpServer", function(chemical){
    var app = chemical.data.app;
    var context = {
      plasma: this.plasma
    };
    var self = this;

    if(config.cwd)
      for(var key in config.cwd)
        config[key] = process.cwd()+"/"+config.cwd[key];
    
    if(config.pageActions) {
      glob(config.pageActions+"/**/*.js", function(err, files){
        files.forEach(function(file){
          context[path.basename(file, path.extname(file))] = require(file);
        });
        self.mountPages(app, config, context, function(){
          self.emit("HttpServerPages");
        });
      });
    } else 
      self.mountPages(app, config, context, function(){
        self.emit("HttpServerPages");
      });

    return false;
  });
}

util.inherits(module.exports, Organel);

module.exports.prototype.mountPages = function(app, config, context, callback){
  var actionsRoot = config.pages;
  var self = this;

  glob(actionsRoot+"/**/*.js", function(err, files){
    files.reverse();
    files.forEach(function(file){
      var url = file.replace("_", ":").split("\\").join("/").replace(actionsRoot, "");
      if(config.mount)
        url = config.mount+url;

      if(file.indexOf(".jade.js") !== -1) {
        if(file.indexOf("index.jade.js") === -1)
          self.mountPageCode(app, url.replace(".jade.js", ""), file);
        else
          self.mountPageCode(app, url.replace("/index.jade.js", ""), file);
      } else {
        var actions = require(file).call(context, config);
        if(file.indexOf("index.js") === -1)
          self.mountPageRenders(app, url.replace(".js", ""), actions, file.replace(".js", ".jade"));
        else
          self.mountPageRenders(app, url.replace("/index.js", ""), actions, file.replace(".js", ".jade"));
      }
    });
    self.mountPagesWithoutActions(app, config, context, callback);
  });
}

module.exports.prototype.mountPagesWithoutActions = function(app, config, context, callback) {
  var actionsRoot = config.pages;
  var self = this;

  glob(actionsRoot+"/**/*.jade", function(err, files){
    files.reverse();
    files.forEach(function(file){
      if(!fs.existsSync(file.replace(".jade", ".js"))) {
        var url = file.replace("_", ":").split("\\").join("/").replace(actionsRoot, "");
        if(config.mount)
          url = config.mount+url;

        var actions = {
          "GET": function(req, res) {
            res.sendPage();
          }
        }
        if(file.indexOf("index.jade") === -1)
          self.mountPageRenders(app, url.replace(".jade", ""), actions, file);
        else
          self.mountPageRenders(app, url.replace("/index.jade", ""), actions, file);
      }
    });
    if(callback) callback();
  });
}

module.exports.prototype.mountPageCode = function(app, url, file) {
  var self = this;
  if(url == "")
    url = "/code.js";
  else
    url += "/code.js";
  console.log("pagecode GET", url);
  app.get(url, function(req, res){
    self.emit({
      type: "BundleCode",
      code: file, 
      data: _.extend({}, req)
    }, function(c){
      if(process.env.CELL_MODE != "development") {
        var modified = true;
        try {
          var mtime = new Date(req.headers['if-modified-since']);
          if (mtime.getTime() >= self.started.getTime()) {
            modified = false;
          }
        } catch (e) {
          console.warn(e);
        }
        if (!modified) {
          res.writeHead(304);
          res.end();
        } else {
          res.setHeader('last-modified', self.started.toUTCString());
          res.setHeader("content-type", "text/javascript");
          res.send(c.data);
        }
      } else {
        res.setHeader("content-type", "text/javascript");
        res.send(c.data);
      }
    });
  })
}

module.exports.prototype.mountPageRenders = function(app, root, actions, template) {
  var root = actions.root || root;

  for(var key in actions) {
    if(key == "routes") {
      this.mountHttpPageRenders(app, root,  actions.routes);
      continue;
    }

    var parts = key.split(" ");
    var method = parts.shift();
    var url = parts.pop();
    var actionHandler = actions[key];
    if(typeof actionHandler === "string") {
      actionHandler = actions[actionHandler];
      if(typeof actionHandler !== "function" && !Array.isArray(actionHandler))
        throw new Error(actionHandler+" was not found");
    }
    this.mountPageRender(app, method, root+(url?url:""), actionHandler, template);
  }
}

module.exports.prototype.applyHelpers = function(template, req, res) {
  var self = this;
  _.extend(req, this.config);
  res.renderPage = function(data, path, callback) {
    if(typeof data == "string") {
      path = data;
      data = {};
    }
    if(typeof path == "function") {
      callback = path;
      path = undefined;
    }

    if(path && path.indexOf("/") != 0)
      path = process.cwd()+"/"+path;
    self.emit(_.extend({
      type: "RenderPage",
      page: path || template
    }, req, data), callback);
  }
  res.sendPage = function(data, path){
    res.renderPage(data, path, function(c){
      res.send(c.data);
    });
  }
}

module.exports.prototype.mountPageRender = function(app, method, url, action, template) {
  var self = this;

  if(url == "")
    url = "/";
  var args = [url];

  if(Array.isArray(action)) {
    _.each(action, function(a){
      args.push(function(req, res, next){
        self.applyHelpers(template, req, res);
        a(req, res, next);
      });
    });
  } else {
    args.push(function(req, res, next){
      self.applyHelpers(template, req, res);
      action(req, res, next);
    });
  }
  
  if(process.env.CELL_MODE == "development")
    console.log(method, url);
  switch(method) {
    case "GET":
      app.get.apply(app, args);
    break;
    case "POST":
      app.post.apply(app, args);
    break;
    case "PUT":
      app.put.apply(app, args);
    break;
    case "DELETE":
      app.del.apply(app, args);
    break;
    case "*":
      app.all.apply(app, args);
    break;
  }
};