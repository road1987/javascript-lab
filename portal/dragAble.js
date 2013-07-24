function getPositionInDocument(element){
						var position = {x : 0, y: 0};
						if(!element){
							return false;
						}
						if(element.offsetParent){
							do{
								position.x += element.offsetLeft;
								position.y += element.offsetTop;
							}while(element = element.offsetParent);
						}
						return position;
}
	var dragAble = function(object , options){
					if(!object)return;

					object = $(object).get(0);
					options = options || {
						handle : null , 
						dragStart : function(){} , 
						draging : function(){} , 
						dragStop : function(){}
					};

					if(!options.handle){options.handle = object;}
					$(options.handle).bind('mousedown' , startMove);
					var startPoint = {x:"" , y:""};	
					function startMove(evt){
						
						$(object).css({	
							position:'absolute' , 
							top : object.offsetTop +'px' , 
							left : object.offsetLeft + 'px' ,
							width : $(object).width(),
							zIndex : 10000
						});
						startPoint = {x : evt.pageX , y : evt.pageY};
						options['handle'].style.cursor = 'move';
						$(document).bind('mousemove' , moving);
						$(document).bind('mouseup' , stopMove);
						if(options.dragStart)options.dragStart();
					};

					function moving(evt){
						var curPoint = {x : evt.pageX , y : evt.pageY},
							d_x = curPoint.x - startPoint.x ,
							d_y = curPoint.y - startPoint.y ,
							pos_x = getPositionInDocument(object).x + d_x ,
						    pos_y = getPositionInDocument(object).y + d_y ;
							
						object.style.left = pos_x  + 'px';
						object.style.top = pos_y + 'px';
						startPoint = curPoint ;

						if(options.draging)options.draging(evt);
						return false;
					};

					function stopMove(evt){
						options['handle'].style.cursor = 'default';
						$(object).css({	
							position:'static' , 
							width : "100%",
							zIndex : 1
						});
						if(options.dragStop)options.dragStop();
						$(document).unbind();
					};
	}

