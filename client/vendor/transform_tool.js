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
}

TransformToolManager.prototype.prepare = function() {

	console.log("-prepare-");

	this.transformTool = document.createElement('div');
	this.transformTool.setAttribute('id', "transformTool");
	this.transformTool.setAttribute('class', "transformTool");
	this.transformTool.innerHTML = 
		'<div id="transformToolBox" class="transformToolBox"></div>' +
		'<div id="tlBox" class="tlTransformBox"></div>' +
		'<div id="trBox" class="trTransformBox"></div>' +
		'<div id="blBox" class="blTransformBox"></div>' +
		'<div id="brBox" class="brTransformBox"></div>';

	_body = document.getElementsByTagName('body')[0];
	_body.appendChild(this.transformTool);

	var transformToolBox = document.getElementById('transformToolBox');
	transformToolBox.onmousedown = function(e) {
		e.preventDefault();
		_slef.onMoveMouseDown(e);
	};
	transformToolBox.ondblclick = function(e) {
		e.preventDefault();
		_slef.toggleMode(e);
	};

	var _slef = this;

	this.tlBox = document.getElementById('tlBox');
	this.tlBox.onmousedown = function(e) {
		e.preventDefault();
		_slef.onResizeMouseDownTL(e);
		//console.log(e);
	};

	this.trBox = document.getElementById('trBox');
	this.trBox.onmousedown = function(e) {
		e.preventDefault();
		_slef.onResizeMouseDownTR(e);
	};

	this.blBox = document.getElementById('blBox');
	this.blBox.onmousedown = function(e) {
		e.preventDefault();
		_slef.onResizeMouseDownBL(e);
	};

	this.brBox = document.getElementById('brBox');
	this.brBox.onmousedown = function(e) {
		e.preventDefault();
		_slef.onResizeMouseDownBR(e);
	};

	var keyDownFn = function(e){
		//console.log(e.keyCode);
		if (e.keyCode == 16)
			_slef.shiftKey = true;

		if (e.keyCode == 27)
			_self.deselectTarget();

	};
	var keyUpFn = function(e){
		if (e.keyCode == 16)
			_slef.shiftKey = false;
	};

	document.onkeydown=keyDownFn;
	document.onkeyup= keyUpFn;

	this.transformTool.style.left = "-5000px";

	//console.log("prepare:", _body, tlBox, trBox, blBox, brBox);
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


TransformToolManager.prototype.selectTarget = function(target) {
	
	//this.transformTool.style.opacity = 1;

	this.target = target;

	var p = this.getPosition(target);
	var curTransform = this.getTransformData(this.target);

	console.log(this.target.offsetLeft, this.target.offsetTop, this.target.offsetWidth, this.target.offsetHeight);

	this.targetData.x = this.target.offsetLeft
	this.targetData.y = this.target.offsetTop;

	this.targetData.scaleX = curTransform.scaleX;
	this.targetData.scaleY = curTransform.scaleY;

	this.targetData.rotation = curTransform.rotation;

	this.targetData.width = this.target.offsetWidth;
	this.targetData.height = this.target.offsetHeight;


	var cx = p.x + (this.targetData.width) / 2 - (this.targetData.width * this.targetData.scaleX) / 2;
	var cy = p.y + (this.targetData.height) / 2 - (this.targetData.height * this.targetData.scaleY) / 2;

	/*if (this.targetData.scaleX < 1)
		cx = p.x + (this.targetData.width * this.targetData.scaleX) / 2;
	else
		cx = p.x + (this.targetData.width * this.targetData.scaleX) / 2;

	if (this.targetData.scaleY < 1)
		cy = p.y + (this.targetData.height * this.targetData.scaleY) / 2;
	else
		cy = p.y + (this.targetData.height * this.targetData.scaleY) / 2;*/

	this.transformTool.style.left = cx + "px";
	this.transformTool.style.top = cy + "px";

	this.transformTool.style.width = (this.targetData.width * this.targetData.scaleX) + "px";
	this.transformTool.style.height = (this.targetData.height * this.targetData.scaleY) + "px";

	console.log("selectTarget", p.x, cx, this.targetData.x, this.targetData.y, this.targetData.width, this.targetData.height, this.targetData.scaleY, this.targetData.scaleY, this.target.offsetWidth, this.target.offsetHeight);
}

TransformToolManager.prototype.deselectTarget = function() {
	this.transformTool.style.left = "-5000px";
}

TransformToolManager.prototype.onResizeMouseDownTL = function(e) {
	//console.log("onResizeMouseDownTL");

	this.selectedRect = this.tlBox;
	this.pocessResizeMouseDown(e);
}

TransformToolManager.prototype.onResizeMouseDownTR = function(e) {
	//console.log("onResizeMouseDownTL");

	this.selectedRect = this.trBox;
	this.pocessResizeMouseDown(e);
}

TransformToolManager.prototype.onResizeMouseDownBL = function(e) {
	//console.log("onResizeMouseDownTL");

	this.selectedRect = this.blBox;
	this.pocessResizeMouseDown(e);
}

TransformToolManager.prototype.onResizeMouseDownBR = function(e) {
	//console.log("onResizeMouseDownTL");

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


	console.log("rotateMouseDown:", p.x, p.y, cx, cy);

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

	//console.log("onRotateMouseMove:", this.targetRotation, Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI), this.startRotation, this.targetRotation + Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) - this.startRotation);

	this.setTransformData(this.target, this.targetData);
	this.setTransformData(this.transformTool, this.transformToolData);

	console.log("onRotateMouseMove:", p.x, p.y, cx, cy, e.clientX, e.clientY, this.targetData.width, this.targetData.scaleX);
}

TransformToolManager.prototype.onRotateMouseUp = function() {
	//console.log("onResizeMouseUp");

	var data = this.getTransformData(this.target);
	this.targetRotation = data.rotation;

	document.onmousemove = null;
	document.onmouseup = null;
}


TransformToolManager.prototype.resizeMouseDown = function(e) {

	this.point.x = e.clientX;
	this.point.y = e.clientY;

	this.transformToolData.x = this.transformTool.offsetLeft
	this.transformToolData.y = this.transformTool.offsetTop;

	this.transformToolData.width = this.transformTool.offsetWidth;
	this.transformToolData.height = this.transformTool.offsetHeight;

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

TransformToolManager.prototype.onResizeMouseMove = function(e)
{
	var w = e.clientX - this.point.x;
	var h = e.clientY - this.point.y;

	/*if (this.shiftKey)
		h = w;*/

	if (this.selectedRect == this.tlBox)
	{
		//console.log("1");

		this.transformTool.style.left = (this.transformToolData.x + w) + "px";
		this.transformTool.style.top = (this.transformToolData.y + h) + "px";

		this.transformTool.style.width = (this.transformToolData.width - w) + "px";
		this.transformTool.style.height = (this.transformToolData.height - h) + "px";
	}
	else
	if (this.selectedRect == this.trBox)
	{
		//console.log("2");

		this.transformTool.style.top = (this.transformToolData.y + h) + "px";

		this.transformTool.style.width = (this.transformToolData.width + w) + "px";
		this.transformTool.style.height = (this.transformToolData.height - h) + "px";
	}
	else
	if (this.selectedRect == this.blBox)
	{
		//console.log("3");

		this.transformTool.style.left = (this.transformToolData.x + w) + "px";

		this.transformTool.style.width = (this.transformToolData.width - w) + "px";
		this.transformTool.style.height = (this.transformToolData.height + h) + "px";
	}
	else
	if (this.selectedRect == this.brBox)
	{
		console.log("4", this.shiftKey);

		if (this.shiftKey)
			hh = this.transformToolData.height * ((this.transformToolData.width + w) / this.transformToolData.width);
		else
			hh = (this.transformToolData.height + h);

		this.transformTool.style.width = (this.transformToolData.width + w) + "px";
		this.transformTool.style.height = hh + "px";
	}

	this.targetData.scaleX = this.transformTool.offsetWidth / this.targetData.width;
	this.targetData.scaleY = this.transformTool.offsetHeight / this.targetData.height;

	this.target.style.left = (this.targetData.x + w / 2) + "px";
	this.target.style.top = (this.targetData.y + h / 2) + "px";

	this.setTransformData(this.target, this.targetData);

	//console.log(this.getTransformData(this.target));
	console.log("onResizeMouseMove", this.shiftKey, w, h, this.targetData.scaleX, this.targetData.scaleY, this.target.offsetLeft, this.target.offsetTop, this.target.offsetWidth, this.target.offsetHeight);
}

TransformToolManager.prototype.onResizeMouseUp = function() {
	//console.log("onResizeMouseUp");

	this.targetData.x = this.target.offsetLeft
	this.targetData.y = this.target.offsetTop;

	document.onmousemove = null;
	document.onmouseup = null;
}

TransformToolManager.prototype.onMoveMouseDown = function(e) {

	this.point.x = e.clientX;
	this.point.y = e.clientY;

	this.transformToolData.x = this.transformTool.offsetLeft
	this.transformToolData.y = this.transformTool.offsetTop;

	this.targetData.x = this.target.offsetLeft
	this.targetData.y = this.target.offsetTop;

	//console.log("onMoveMouseDown", this.point.x, this.point.y);

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

TransformToolManager.prototype.onMoveMouseMove = function(e)
{
	if (!this.shiftKey)
		this.transformTool.style.left = (this.transformToolData.x + e.clientX - this.point.x) + "px";

	this.transformTool.style.top = (this.transformToolData.y + e.clientY - this.point.y) + "px";

	if (!this.shiftKey)
		this.target.style.left = (this.targetData.x + e.clientX - this.point.x) + "px";

	this.target.style.top = (this.targetData.y + e.clientY - this.point.y) + "px";

	//console.log("onMoveMouseMove", this.targetData.x, this.targetData.y);
}

TransformToolManager.prototype.onMoveMouseUp = function() {
	//console.log("onMoveMouseUp");

	this.targetData.x = this.target.offsetLeft
	this.targetData.y = this.target.offsetTop;

	document.onmousemove = null;
	document.onmouseup = null;
}

TransformToolManager.prototype.getTargetTransformInfo = function()
{
	var data = this.getTransformData(this.target);

	return data.scaleX == data.scaleY ? 
			"transform: rotate(" + data.rotation + "deg) scale(" + data.scaleX + ")" : 
			"transform: rotate(" + data.rotation + "deg) scale(" + data.scaleX + "," + data.scaleY + ")";
}

TransformToolManager.prototype.setTransformData = function(target, data)
{
	var str = data.scaleX == data.scaleY ? 
				"rotate(" + data.rotation + "deg) scale(" + data.scaleX + ")" : 
				"rotate(" + data.rotation + "deg) scale(" + data.scaleX + "," + data.scaleY + ")";

	target.style["-webkit-transform"] = str;
	target.style["-moz-transform"] = str;
	target.style["-o-transform"] = str;
	target.style["-ms-transform"] = str;

	console.log("setTransformData:", data, target.style["-moz-transform"], "'" + data.scaleX + "'", "'" + data.scaleY + "'", str);
}

TransformToolManager.prototype.getTransformData = function(target)
{
	var tr = target.style["-webkit-transform"] ||
	         target.style["-moz-transform"] ||
	         target.style["-ms-transform"] ||
	         target.style["-o-transform"];

	console.log("getTransformData: '" + tr + "'");

	var data = {
		rotation: 0,
		scaleX: 1,
		scaleY: 1
	};

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

			console.log("getTransformData: '" + sc + "'");

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

	console.log("extractData", str, s1, s2);

	if (s1 != -1 && s2 != -1)
		return str.substring(s1 + start.length, s2);

	return null;

	//return str.split(start).join("").split(end).join("");
}

TransformToolManager.prototype.toggleMode = function()
{
	this.mode = this.mode == "" ? "rotate" : "";
}