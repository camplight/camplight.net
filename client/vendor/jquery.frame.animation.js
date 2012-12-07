/**
 * @author Bojmir Martinec
 * v. 1.1.2 (Firefox 4 fix by Miro Hristov)
 */
(function($) {
   $.fn.frameAnimation = function(settings) {
     var config = {
				'endWithFrameOne': false,
				'delay': 50,
				'repeat': 1,  
				'mouseOut': true,
				'hoverMode': true,
				'reverse':true,  // if reverse is set to false, you have to specify imageHeight as a parameter
				'startFrame':1 
				};
 
    if (settings){ 
		$.extend(config, settings);
		
	}
	
		settings = config;
		
		
     this.each(function() {
		var step =  parseInt($(this).outerHeight());
		
		var limit =  parseInt(backgroundPosition($(this)).split(' ')[1]);

		var offset = limit;
		if (settings.imageHeight != undefined){
			var height = settings.imageHeight;
			if (settings.reverse == true){
				limit = step - height;
				offset = settings.startFrame*step - height;
			}
			else{
				limit = step - height;
				offset = (settings.startFrame-1)*step;
			}

			$(this).css('background-position-y', offset + "px");
			
		}
		
		var delay = settings.delay;
		var numRepeatOver = settings.repeat;
		var numRepeatOut = settings.repeat;
		if (settings.numRepeatOut != undefined)
			numRepeatOut = settings.numRepeatOut;
		var repet = 1;
		var t;
		var movingUp = false;
		var movingDown = false;
		var hoverMode = settings.hoverMode;

/*///////////////////////// FUNCTIONS ///////////////////////////////////////*/	
	
		function backgroundPosition(obj){
			bgPos = obj.css('background-position');
			if(typeof(bgPos) === 'undefined') { bgPos = obj.css('background-position-x') + ' ' + obj.css('background-position-y') };
			
			return bgPos;
		}	
			
		var moveDown = function(obj){
		
			offset += step;
			obj.css('background-position', ('0px ' + offset + 'px'));
		}
		
		var moveUp = function(obj){
			
			offset -= step;
			obj.css('background-position', ('0px ' + offset + 'px'));
		}
		
		var animateDown = function(obj, times){
			if (movingUp == true) return;
			
			offset = parseInt(backgroundPosition(obj).split(' ')[1]);
			t = null;
			if (offset  >= 0) {
				
					offset = limit;
				if (repet == times){
					
					if (times < numRepeatOut && settings.hoverMode == true && settings.mouseOut == true) repet = numRepeatOut;
					if (settings.mouseOut == false){
						repet = 1;
						obj.css('background-position', ('0px ' + offset + 'px'));
					}
					if (settings.endWithFrameOne == true && hoverMode == false){
						obj.css('background-position', ('0px ' + offset + 'px'));
						repet = 0;
					}
					movingDown = false;
					
					return;
				}
				repet++;
			
			}
			if (movingUp == false)
				moveDown(obj);
			
			t = setTimeout(function(){animateDown(obj, times)}, delay);
		}
		
		var animateUp = function(obj, times){
			
			if (repet > times) {   // if numRepeatOver and numRepeatOut are set differently...
				repet = times;
			}
			
			if (movingDown == true) return;
			
			offset = parseInt(backgroundPosition(obj).split(' ')[1]);
			t = null;
			if (offset  <= limit ) {
			
					offset = 0;
					

				if (repet <= 1){
					if (settings.mouseOut == false){
						repet = 1;
						obj.css('background-position-y', offset + "px");
					}
					movingUp = false;
					return;
				}
			
				repet--;
			}
			if (movingDown == false)
				moveUp(obj);
			t = setTimeout(function(){animateUp(obj, times)}, delay);
		}
	
/*///////////////////////// LOGIC ///////////////////////////////////////*/	
		
	  if (hoverMode == true && settings.mouseOut != false){	
		if (settings.reverse == true){
			$(this).hover(function(evt){
				movingUp = false;
				movingDown = true;
				animateDown($(evt.target), numRepeatOver);
				return false;
			}, 	function(evt){
				movingDown = false;
				movingUp = true;
				animateUp($(evt.target), numRepeatOut);
				return false;
				}
			);
		}
		else if (settings.reverse == false && settings.imageHeight != undefined) {
			$(this).hover(function(evt){
				movingDown = false;
				movingUp = true;
				animateUp($(evt.target), numRepeatOut);
				return false;
			}, 	function(evt){
				movingUp = false;
				movingDown = true;
				animateDown($(evt.target), numRepeatOver);
				return false;
				}
			);
		}
	  }
	  else if (hoverMode == true && settings.mouseOut == false){
		if (settings.reverse==true){
			$(this).hover(function(evt){
			if (movingDown == false){
				movingDown = true;
				animateDown($(evt.target), numRepeatOver);
			}
			return false;
			}, 	function(evt){
				return false;
			}
			);
		}
		else if (settings.reverse == false && settings.imageHeight != undefined) {
			$(this).hover(function(evt){
			if (movingUp == false){
				movingUp = true;
				animateUp($(evt.target), numRepeatOver);
			}
			return false;
			}, 	function(evt){
				return false;
			}
			);
		}
	  }  //elsif
	  else {
		if (settings.reverse == true)
		 animateDown($(this), numRepeatOver);
		else if (settings.reverse == false && settings.imageHeight != undefined)
		 animateUp($(this), numRepeatOver);
	  }
		

		});
 
     return this;
 
   };
 
 })(jQuery);

