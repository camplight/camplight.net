module.exports = TransformToolManager = function() {

	this.point = {
		x: 0,
		y: 0
	};	

	this.selectedRect = null;

	this.tlBox = null;
	this.trBox = null;
	this.blBox = null;
	this.brBox = null;

	this.transformToolData = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		scaleX: 1,
		scaleY: 1,
		rotation: 0
	};

	this.tmpTransformToolData = {};

	this.targetData = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		scaleX: 1,
		scaleY: 1,
		rotation: 0
	};

	this.mode = "";
	this.startRotation = null;
	this.targetRotation = null;

	this.target = null;

	this.shiftKey = false;
	this.ctrlKey = false;
	this.altKey = false;

	this.updateFn = null;
}

TransformToolManager.prototype.prepare = function() {

	this.transformTool = document.createElement('div');
	this.transformTool.setAttribute('id', "transformTool");
	this.transformTool.setAttribute('class', "transformTool");
	this.transformTool.innerHTML = 
		'<div id="transformToolBox" class="transformToolBox"></div>' +
		'<div id="tlBox" class="tlTransformBox"></div>' +
		'<div id="trBox" class="trTransformBox"></div>' +
		'<div id="blBox" class="blTransformBox"></div>' +
		'<div id="brBox" class="brTransformBox"></div>' + 

		'<div id="tlPoint" class="tlPoint"></div>' + 
		'<div id="trPoint" class="trPoint"></div>' + 
		'<div id="blPoint" class="blPoint"></div>' + 
		'<div id="brPoint" class="brPoint"></div>';

	_body = document.getElementsByTagName('body')[0];
	_body.appendChild(this.transformTool);

	var transformToolBox = document.getElementById('transformToolBox');
	transformToolBox.onmousedown = function(e) {
		e.preventDefault();
		_self.onMoveMouseDown(e);
	};
	transformToolBox.ondblclick = function(e) {
		e.preventDefault();
		_self.toggleMode(e);
	};

	var _self = this;

	this.tlBox = document.getElementById('tlBox');
	this.tlBox.onmousedown = function(e) {
		e.preventDefault();
		_self.onResizeMouseDownTL(e);
	};

	this.trBox = document.getElementById('trBox');
	this.trBox.onmousedown = function(e) {
		e.preventDefault();
		_self.onResizeMouseDownTR(e);
	};

	this.blBox = document.getElementById('blBox');
	this.blBox.onmousedown = function(e) {
		e.preventDefault();
		_self.onResizeMouseDownBL(e);
	};

	this.brBox = document.getElementById('brBox');
	this.brBox.onmousedown = function(e) {
		e.preventDefault();
		_self.onResizeMouseDownBR(e);
	};

	this.tlPoint = document.getElementById('tlPoint');
	this.trPoint = document.getElementById('trPoint');
	this.blPoint = document.getElementById('blPoint');
	this.brPoint = document.getElementById('brPoint');

	var keyDownFn = function(e){
		if (e.keyCode == 16)
			_self.shiftKey = true;

		if (e.keyCode == 17)
			_self.ctrlKey = true;

		if (e.keyCode == 18)
			_self.altKey = true;

		switch (e.keyCode)
		{
			case 27:
				_self.deselectTarget();
			break;
			case 37: // left
				_self.moveTarget(_self.shiftKey ? -10 : -1, 0);
			break;
			case 39: // right
				_self.moveTarget(_self.shiftKey ? 10 : 1, 0);
			break;
			case 38: // up
				_self.moveTarget(0, _self.shiftKey ? -10 : -1);
			break;
			case 40: // down
				_self.moveTarget(0, _self.shiftKey ? 10 : 1);
			break;
			case 68: // D
				if (_self.ctrlKey && _self.ctrlKey)
					_self.deselectTarget();
			break;
		}

	};
	var keyUpFn = function(e){

		switch (e.keyCode)
		{
			case 16:
				_self.shiftKey = false;
			break;
			case 17:
				_self.ctrlKey = false;
			break;
			case 18:
				_self.altKey = false;
			break;
		}
	};

	document.onkeydown=keyDownFn;
	document.onkeyup= keyUpFn;

	this.transformTool.style.left = "-5000px";
}

TransformToolManager.prototype.selectTarget = function(target) {
	this.target = target;

	this.readTransformData();
	this.updateTransform();
}

TransformToolManager.prototype.updateTransform = function() {

	this.setTransformData(this.target, this.targetData);
	this.setTransformData(this.transformTool, this.transformToolData);
}

TransformToolManager.prototype.readTransformData = function() {

	this.targetData = this.getTransformData(this.target);
	this.readTransformToolData();
}

TransformToolManager.prototype.readTransformToolData = function() {

	var p = this.getPosition(this.target);

	this.transformToolData.x = p.x + (this.targetData.width) / 2 - (this.targetData.width * this.targetData.scaleX) / 2;
	this.transformToolData.y = p.y + (this.targetData.height) / 2 - (this.targetData.height * this.targetData.scaleY) / 2;

	this.transformToolData.width = this.targetData.width * this.targetData.scaleX;
	this.transformToolData.height = this.targetData.height * this.targetData.scaleY;
	this.transformToolData.rotation = this.targetData.rotation;
}

TransformToolManager.prototype.deselectTarget = function() {
	this.transformTool.style.left = "-5000px";
	this.target = null;
}

TransformToolManager.prototype.onResizeMouseDownTL = function(e) {
	this.selectedRect = this.tlBox;
	this.pocessResizeMouseDown(e);
}

TransformToolManager.prototype.onResizeMouseDownTR = function(e) {
	this.selectedRect = this.trBox;
	this.pocessResizeMouseDown(e);
}

TransformToolManager.prototype.onResizeMouseDownBL = function(e) {
	this.selectedRect = this.blBox;
	this.pocessResizeMouseDown(e);
}

TransformToolManager.prototype.onResizeMouseDownBR = function(e) {
	this.selectedRect = this.brBox;
	this.pocessResizeMouseDown(e);
}

TransformToolManager.prototype.pocessResizeMouseDown = function(e) {
	if (this.mode == "rotate")
		this.rotateMouseDown(e);
	else
		this.resizeMouseDown(e);
}

TransformToolManager.prototype.rotateMouseDown = function(e) {

	this.point.x = e.clientX;
	this.point.y = e.clientY;

	this.transformToolData.x = this.transformTool.offsetLeft
	this.transformToolData.y = this.transformTool.offsetTop;

	this.transformToolData.width = this.transformTool.offsetWidth;
	this.transformToolData.height = this.transformTool.offsetHeight;

	var p = this.getPosition(this.target);

	var cx = p.x + (this.targetData.width) / 2;
	var cy = p.y + (this.targetData.height) / 2;
	var data = this.getTransformData(this.target);


	this.startRotation = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);	
	this.targetRotation = data.rotation;


	var _self = this;

	document.onmousemove = function(e) {
		e.preventDefault();
		_self.onRotateMouseMove(e);
	};
	document.onmouseup = function(e) {
		e.preventDefault();
		_self.onRotateMouseUp(e);
	};
}

TransformToolManager.prototype.onRotateMouseMove = function(e) {

	var p = this.getPosition(this.target);

	var cx = p.x + (this.targetData.width) / 2;
	var cy = p.y + (this.targetData.height) / 2;

	this.targetData.rotation = this.targetRotation + Math.atan2(e.pageY - cy, e.pageX - cx) * (180 / Math.PI) - this.startRotation;	
	this.transformToolData.rotation = this.targetData.rotation;

	this.setTransformData(this.target, this.targetData);
	this.setTransformData(this.transformTool, this.transformToolData);

	if (this.updateFn)
		this.updateFn();
}

TransformToolManager.prototype.onRotateMouseUp = function() {
	var data = this.getTransformData(this.target);
	this.targetRotation = data.rotation;

	if (this.updateFn)
		this.updateFn();

	document.onmousemove = null;
	document.onmouseup = null;
}


TransformToolManager.prototype.resizeMouseDown = function(e) {



	/*if (this.selectedRect == this.tlBox)
	{
		//console.log("1");




		this.targetData.x = this.tmpTransformToolData.x + w;
		this.targetData.y = this.tmpTransformToolData.y + h;

		this.targetData.scaleX = (this.tmpTransformToolData.width - w) / this.targetData.width;
		this.targetData.scaleY = (this.tmpTransformToolData.height - h) / this.targetData.height;
	}
	else
	if (this.selectedRect == this.trBox)
	{
		//console.log("2");

		this.targetData.y = this.tmpTransformToolData.y + h;

		this.targetData.scaleX = (this.tmpTransformToolData.width + w) / this.targetData.width;
		this.targetData.scaleY = (this.tmpTransformToolData.height - h) / this.targetData.height;
	}
	else
	if (this.selectedRect == this.blBox)
	{
		//console.log("3");

		this.targetData.x = (this.tmpTransformToolData.x + w);

		this.targetData.scaleX = (this.tmpTransformToolData.width - w) / this.targetData.width;
		this.targetData.scaleY = (this.tmpTransformToolData.height + h) / this.targetData.height;
	}
	else*/
	if (this.selectedRect == this.brBox)
	{
		this.tmpP1 = this.getPosition(this.tlPoint);
		this.tmpP2 = this.getPosition(this.brPoint);
	}

	/*this.point.x = e.clientX;
	this.point.y = e.clientY;

	this.tmpTransformToolData.x = this.transformToolData.x
	this.tmpTransformToolData.y = this.transformToolData.y;

	this.tmpTransformToolData.width = this.transformToolData.width;
	this.tmpTransformToolData.height = this.transformToolData.height;*/

	this.point.x = e.clientX;
	this.point.y = e.clientY;

	var points = this.rectPoints(this.tmpP1, this.tmpP2, this.transformToolData.rotation);

	this.transformToolData.width = this.distance(this.tmpP1, points.point2);
	this.transformToolData.height = this.distance(this.tmpP1, points.point1);

	this.setTransformData(this.transformTool, this.transformToolData);

	var _self = this;

	document.onmousemove = function(e) {
		e.preventDefault();
		_self.onResizeMouseMove(e);
	};
	document.onmouseup = function(e) {
		e.preventDefault();
		_self.onResizeMouseUp(e);
	};
}

TransformToolManager.prototype.rectPoints = function(point1, point2, angle)
{
	angle *= Math.PI / 180;

	var r = (point2.x - point1.x)*Math.sin(angle) - (point2.y - point1.y)*Math.cos(angle);

	var x3 = point1.x + r*Math.sin(angle);
	var y3 = point1.y - r*Math.cos(angle);
	var x4 = point2.x - r*Math.sin(angle);
	var y4 = point2.y + r*Math.cos(angle);

	return {
		point1: {
			x: x3,
			y: y3	
		},
		point2: {
			x: x4,
			y: y4	
		}
	};
}

TransformToolManager.prototype.distance = function(point1, point2)
{
	var xs = (point2.x - point1.x) * (point2.x - point1.x);
	var ys = (point2.y - point1.y) * (point2.y - point1.y);
	 
	return Math.sqrt(xs + ys);
}

TransformToolManager.prototype.onResizeMouseMove = function(e)
{
	var w = e.clientX - this.point.x;
	var h = e.clientY - this.point.y;

	/*if (this.shiftKey)
		h = w;*/

	if (this.selectedRect == this.tlBox)
	{
		this.targetData.x = this.tmpTransformToolData.x + w;
		this.targetData.y = this.tmpTransformToolData.y + h;

		this.targetData.scaleX = (this.tmpTransformToolData.width - w) / this.targetData.width;
		this.targetData.scaleY = (this.tmpTransformToolData.height - h) / this.targetData.height;
	}
	else
	if (this.selectedRect == this.trBox)
	{
		this.targetData.y = this.tmpTransformToolData.y + h;

		this.targetData.scaleX = (this.tmpTransformToolData.width + w) / this.targetData.width;
		this.targetData.scaleY = (this.tmpTransformToolData.height - h) / this.targetData.height;
	}
	else
	if (this.selectedRect == this.blBox)
	{
		this.targetData.x = (this.tmpTransformToolData.x + w);

		this.targetData.scaleX = (this.tmpTransformToolData.width - w) / this.targetData.width;
		this.targetData.scaleY = (this.tmpTransformToolData.height + h) / this.targetData.height;
	}
	else
	if (this.selectedRect == this.brBox)
	{
		/*if (this.shiftKey)
			hh = this.tmpTransformToolData.height * ((this.tmpTransformToolData.width + w) / this.targetData.width);
		else
			hh = (this.tmpTransformToolData.height + h);*/

		this.tmpP2.x += w;
		this.tmpP2.y += h;

		var points = this.rectPoints(this.tmpP1, this.tmpP2, this.transformToolData.rotation);

		this.transformToolData.width = this.distance(this.tmpP1, points.point2);
		this.transformToolData.height = this.distance(this.tmpP1, points.point1);

		//this.targetData.scaleX = (this.tmpTransformToolData.width + w) / this.targetData.width;
		//this.targetData.scaleY = (this.tmpTransformToolData.height + h) / this.targetData.height;

		//console.log("1.onResizeMouseMove:", this.transformTool.offsetWidth, this.transformTool.offsetHeight, this.distance(this.tmpP1, points.point2), this.distance(this.tmpP1, points.point1));
	}


	this.setTransformData(this.transformTool, this.transformToolData);

	this.point.x = e.clientX;
	this.point.y = e.clientY;

	/*this.setTransformData(this.target, this.targetData);
	
	this.readTransformToolData();
	this.setTransformData(this.transformTool, this.transformToolData);

	//this.targetData.scaleX = this.transformTool.offsetWidth / this.targetData.width;
	//this.targetData.scaleY = this.transformTool.offsetHeight / this.targetData.height;

	/*this.target.style.left = (this.targetData.x + w / 2) + "px";
	this.target.style.top = (this.targetData.y + h / 2) + "px";

	this.setTransformData(this.target, this.targetData);*/

	if (this.updateFn)
		this.updateFn();
}

TransformToolManager.prototype.onResizeMouseUp = function() {
	//console.log("onResizeMouseUp");

	//this.targetData.x = this.target.offsetLeft
	//this.targetData.y = this.target.offsetTop;

	document.onmousemove = null;
	document.onmouseup = null;
}

// ************************** MOVE ******************************

TransformToolManager.prototype.onMoveMouseDown = function(e) {

	this.point.x = e.clientX;
	this.point.y = e.clientY;

	var _self = this;

	document.onmousemove = function(e) {
		e.preventDefault();
		_self.onMoveMouseMove(e);
	};
	document.onmouseup = function(e) {
		e.preventDefault();
		_self.onMoveMouseUp(e);
	};
}

TransformToolManager.prototype.onMoveMouseMove = function(e) {

	this.moveTarget(this.shiftKey ? 0 : e.clientX - this.point.x, e.clientY - this.point.y);
	this.setTransformData(this.target, this.targetData);
	
	this.readTransformToolData();
	this.setTransformData(this.transformTool, this.transformToolData);

	this.point.x = e.clientX;
	this.point.y = e.clientY;
}

TransformToolManager.prototype.onMoveMouseUp = function() {
	document.onmousemove = null;
	document.onmouseup = null;
}

TransformToolManager.prototype.moveTarget = function(xOffset, yOffset) {

	this.targetData.x += xOffset;
	this.targetData.y += yOffset;

	this.setTransformData(this.target, this.targetData);
	
	this.readTransformToolData();
	this.setTransformData(this.transformTool, this.transformToolData);

	if (this.updateFn)
		this.updateFn();
}

// ************************** MOVE ******************************

TransformToolManager.prototype.getTargetTransformInfo = function() {
	var data = this.getTransformData(this.target);

	return data.scaleX == data.scaleY ? 
			"transform: rotate(" + data.rotation + "deg) scale(" + data.scaleX + ")" : 
			"transform: rotate(" + data.rotation + "deg) scale(" + data.scaleX + "," + data.scaleY + ")";
}

TransformToolManager.prototype.setTransformData2 = function(target, data) {
	var str = data.scaleX == data.scaleY ? 
				"rotate(" + data.rotation + "deg) scale(" + data.scaleX + ")" : 
				"rotate(" + data.rotation + "deg) scale(" + data.scaleX + "," + data.scaleY + ")";

	target.style["-webkit-transform"] = str;
	target.style["-moz-transform"] = str;
	target.style["-o-transform"] = str;
	target.style["-ms-transform"] = str;
}

TransformToolManager.prototype.setTransformData = function(target, data) {

	if (data.x)
		target.style.left = data.x + "px";

	if (data.y)
		target.style.top = data.y + "px";

	if (data.width)
		target.style.width = data.width + "px";

	if (data.height)
		target.style.height = data.height + "px";

	var stylesArr = [];

	if (data.scaleX == data.scaleY)
		stylesArr.push("scale(" + data.scaleX + ")");
	else
		stylesArr.push("scale(" + data.scaleX + "," + data.scaleY + ")");

	if (data.rotation)
		stylesArr.push("rotate(" + data.rotation + "deg)");

	var str = stylesArr.join(" ");

	target.style["-webkit-transform"] = str;
	target.style["-moz-transform"] = str;
	target.style["-o-transform"] = str;
	target.style["-ms-transform"] = str;
}

TransformToolManager.prototype.getTransformData = function(target) {

	var data = {
		x: target.offsetLeft,
		y: target.offsetTop,
		width: target.offsetWidth,
		height: target.offsetHeight,
		rotation: 0,
		scaleX: 1,
		scaleY: 1
	};

	var tr = target.style["-webkit-transform"] ||
	         target.style["-moz-transform"] ||
	         target.style["-ms-transform"] ||
	         target.style["-o-transform"];

	if (tr)
	{
		var rot = this.extractData(tr, "rotate(", "deg)");

		if (rot)
			data.rotation = parseFloat(rot);

		var scX = this.extractData(tr, "scaleX(", ")");
		var scY = this.extractData(tr, "scaleY(", ")");

		if (scX || scY)
		{
			if (scX)
				data.scaleX = parseFloat(scX);

			if (scY)
				data.scaleX = parseFloat(scY);
		}
		else
		{
			var sc = this.extractData(tr, "scale(", ")");

			//console.log("getTransformData: '" + sc + "'");

			if (sc.indexOf(",") != -1)
			{
				sc = (sc + " ").split(" ").join("");
				var scls = sc.split(",");

				data.scaleX = scls[0];
				data.scaleY = scls[1];
			}
			else
			{
				data.scaleX = parseFloat(sc);
				data.scaleY = data.scaleX;
			}
		}
	}

	return data;
}

TransformToolManager.prototype.extractData = function(str, start, end)
{
	var s1 = str.indexOf(start);
	var s2 = str.indexOf(end, s1);

	if (s1 != -1 && s2 != -1)
		return str.substring(s1 + start.length, s2);

	return null;
}

TransformToolManager.prototype.toggleMode = function()
{
	this.mode = this.mode == "" ? "rotate" : "";
}

TransformToolManager.prototype.getPosition = function(target) {
    o = target;
    var l =o.offsetLeft; var t = o.offsetTop;
    while (o=o.offsetParent)
    	l += o.offsetLeft;
    o = target;
    while (o=o.offsetParent)
    	t += o.offsetTop;
    return {
    	x: l, 
    	y: t
    };
}