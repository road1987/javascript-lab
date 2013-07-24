(function(){
	if(!window.EAS)window.EAS = {};
	EAS.ui = {};

	EAS.ui.base = {
		dragAble : function(object , options){
					if(!object)return;
					var util = EAS.ui.util;

					object = util.get(object);
					options = options || {
						handle : null , 
						dragStart : function(){} , 
						draging : function(){} , 
						dragStop : function(){}
					};

					if(!options.handle){options.handle = object;}
					$(options.handle).bind('mousedown' , startMove);

					$(object.parentNode).css({position:'relative'});
					var startPoint = {x:"" , y:""};	
					function startMove(evt){
						if(!EAS.ui.util.getMouseButton(evt).left)return false;
						$(object).css({position:'absolute' , top : object.offsetTop +'px' , left : object.offsetLeft + 'px' ,margin:'0px'});
						startPoint = util.getMouseInDocument(evt);
						options['handle'].style.cursor = 'move';
						$(document).bind('mousemove' , moving);
						$(document).bind('mouseup' , stopMove);

						if(options.dragStart)options.dragStart();
					};

					function moving(evt){
						var curPoint = util.getMouseInDocument(evt),
							d_x = curPoint.x - startPoint.x ,
							d_y = curPoint.y - startPoint.y ,
							pos_x = util.getPosValue(object).left + d_x ,
						    pos_y = util.getPosValue(object).top + d_y ;

						object.style.left = pos_x  + 'px';
						object.style.top = pos_y + 'px';
						startPoint = curPoint ;

						if(options.draging)options.draging();
						return false;
					};

					function stopMove(evt){
						options['handle'].style.cursor = 'default';
						if(options.dragStop)options.dragStop();
						$(document).unbind();
					};
		}
	};
	
	EAS.ui.util = {
			get : function(element) {
				  if (arguments.length > 1) {
					for (var i = 0, elements = [], length = arguments.length; i < length; i++)
					  elements.push(get(arguments[i]));
					return elements;
				  }
				  if (typeof element == 'string')
					element = document.getElementById(element);
				  return element;
			},

			getEventObject : function(W3CEvent){
				return  window.event || W3CEvent;
			},

			getBodyScrolled : function(){
				var scrolled = {x:0 , y:0};
				if(window.pageYOffset){
					scrolled.x = window.pageXOffset;
					scrolled.y = window.pageYOffset;
				}
				else if(document.documentElement)
				{
					scrolled.x = document.documentElement.scrollLeft;
					scrolled.y = document.documentElement.scrollTop;
				}
				else if(document.body){
					scrolled.x = document.body.scrollLeft;
					scrolled.y = document.body.scrollTop;
				}
				return 	scrolled;
			},

			getMouseInDocument : function(W3CEvent){
				var util = EAS.ui.util;
				W3CEvent = util.getEventObject(W3CEvent);
				var x = W3CEvent.pageX || (W3CEvent.clientX + util.getBodyScrolled().x);
				var y = W3CEvent.pageY || (W3CEvent.clientY + util.getBodyScrolled().y);
				return {'x':x,'y':y};
			},
			
			stripPX : function(str){
				return str.replace(/px/i , '');
			},
			
			getPosValue : function(element){
				var util = EAS.ui.util;
				element = util.get(element);
				var top = util.getStyle(element , 'top');
					left = util.getStyle(element , 'left');
				return {top : parseInt(util.stripPX(top)) , left : parseInt(util.stripPX(left)) };
			},

			getStyle : function(element, prop){
				var util = EAS.ui.util;
				element = util.get(element);
				if (element.currentStyle) {
					return element.currentStyle[prop];
				}
				else if (window.getComputedStyle) {
					return window.getComputedStyle(element, '').getPropertyValue(prop);
				}
				return null;
			},
			
			 getMouseButton : function(W3CEvent){
				W3CEvent = W3CEvent || window.event ;
				var buttons = {'left':false,'middle':false,'right':false};
				if(W3CEvent.toString && W3CEvent.toString().indexOf('MouseEvent') != -1){
					switch(W3CEvent.button){
						case 0: buttons.left = true; break;
						case 1: buttons.middle = true; break;
						case 2: buttons.right = true; break;
						default: break;
						}
				} else if(W3CEvent.button){		   
					   switch(W3CEvent.button){
						   case 1: buttons.left = true; break;
						   case 2: buttons.right = true; break;
						   case 3:
								buttons.left = true;
								buttons.right = true;
								break;
						   case 4:	buttons.middle = true; break;
						   case 5:
								buttons.left = true;
								buttons.middle = true;
								break;
						   case 6:
								buttons.middle = true;
								buttons.right = true;
								break;
						   case 7:
								buttons.left = true;
								buttons.middle = true;
								buttons.right = true;
								break;
						   default: break;
						   }
					} else {
						return false;
					}
				 return buttons;	
				}
	};
})()