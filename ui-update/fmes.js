(function(window , undefined){
	var fmes = {
		version : 1.0
	};

	fmes.Browser = (function(){
		var ua = navigator.userAgent;
		var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
		return {
			isIE:             !-[1,],
			isOpera:          isOpera,
			isWebKit:         ua.indexOf('AppleWebKit/') > -1,
			isGecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
			isMobileSafari:   /Apple.*Mobile/.test(ua)
		}; 
	})();
	
	fmes.Util = (function(){
		var toString = Object.prototype.toString;
		return {
			each : function(obj, callback , args){
				if ( args ) {
					if ( obj.length == undefined ){
						for ( var i in obj )
						callback.apply( obj, args );
					}else{
						for ( var i = 0, ol = obj.length; i < ol; i++ ) {
							if ( callback.apply( obj, args ) === false )break; 
						}
					}
				}else {
					if ( obj.length == undefined ) {
						for ( var i in obj ){
							callback.call( obj, i, obj );
						}
					}else{
						for ( var i = 0, ol = obj.length, val = obj[0]; i < ol && callback.call(val,i,val) !== false; val = obj[++i] ){} 
					}
				}
				return obj;
			},
			
			xmlToString : function(xml){
				if(window.ActiveXObject) {
					return xml.xml;
			    }else{
			        return (new XMLSerializer()).serializeToString(xml);
			    }
			},
			
			stringToXml : function(string){
				var xml;
				if (window.ActiveXObject)
				{
					xml = new ActiveXObject('Microsoft.XMLDOM');
					xml.async = 'false';
					xml.loadXML(string);
				} else {
					xml = (new DOMParser()).parseFromString(string, 'text/xml');
				}
				return xml;		
			},
			
			stringToJson : function(data){
				return new Function('return ' +  data)();
			},
			
			jsonToString : function(obj){
	            switch(typeof(obj)){  
		            case 'string':  
		                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';  
		            case 'array':  
		                return '[' + obj.map(fmes.Util.jsonToString).join(',') + ']';  
		            case 'object':  
		                 if(obj instanceof Array){  
		                    var strArr = [];  
		                    var len = obj.length;  
		                    for(var i=0; i<len; i++){  
		                        strArr.push(fmes.Util.jsonToString(obj[i]));  
		                    }  
		                    return '[' + strArr.join(',') + ']';  
		                }else if(obj==null){  
		                    return 'null';  
		                }else{  
		                    var string = [];  
		                    for (var property in obj) string.push(fmes.Util.jsonToString(property) + ':' +fmes.Util.jsonToString(obj[property]));  
		                    return '{' + string.join(',') + '}';  
		                }  
		            case 'number': 
		            case 'boolean':
		                return obj;  
		            default :  
		                return obj;  
	            }		
			},
			
			/*
			 *data{key:value,key:[value,value]} 
			 **/
			jsonToQueryString : function(data){
				var Util = fmes.Util;
				var result = [];
				for(var i in data){
					var key = encodeURIComponent(i) , value = data[i];
					if(value && Util.isArray(value)){
						for(var j = 0 , jLen = value.length , _value; j < jLen ; j++){
							_value = encodeURIComponent(value[j]);
							result.push(key + '=' + _value);
						}
					}else{
						if(Util.isUndefined(value)){
							result.push(key);
						}else{
							value = encodeURIComponent(value);
							result.push(key + '=' + value);
						}
					}
				}
				return result.join('&');
			},
			
			// type test
			isElement : function(object) {
			    return !!(object && object.nodeType == 1);
			},

			isArray : function(object) {
			    return toString.call(object) == "[object Array]";
			},

			isFunction : function(object) {
			    return typeof object === "function";
			},

			isString : function(object) {
			    return toString.call(object) == "[object String]";
			},

			isNumber : function(object) {
			    return toString.call(object) == "[object Number]";
			},

			isUndefined : function(object) {
			    return typeof object === "undefined";
			}
		}//end of fmes.Util return 
	})();

	fmes.Array = (function(){
		if (!Array.prototype.indexOf) {   
				Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {    
			      if (this == null) {   
			          throw new TypeError();   
			      }   
			      var t = Object(this);   
			      var len = t.length >>> 0;   
			      if (len === 0) {   
			           return -1;   
			      }   
			      var n = 0;   
			      if (arguments.length > 0) {   
			            n = Number(arguments[1]);   
			            if (n != n) { // shortcut for verifying if it's NaN   
			               n = 0;   
			            } else if (n != 0 && n != Infinity && n != -Infinity) {   
			               n = (n > 0 || -1) * Math.floor(Math.abs(n));   
			           }   
			      }   
			      if (n >= len) {   
			           return -1;   
			      }   
			      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);   
			      for (; k < len; k++) {   
			            if (k in t && t[k] === searchElement) {   
			               return k;   
			            }
			      }   
		       return -1;   
		   }
		}
		
		return {
			include : function(array, object){
				if(array.indexOf(object) != -1){
					return true;
				}else{
					return false;
				}
			}
		}
	})();
	
	fmes.Dom = {
		createElement : function (name, config ){
			var Dom = fmes.Dom , Css = fmes.Css ; 
			var elem = document.createElement(name);
			if(config){
				if(config.attr){
					Dom.setAttribute(elem , config.attr);
				}
				if(config.css){
					Css.setStyle(elem , config.css);
				}
				if(config.content){
					Dom.append(config.content , elem);
				}
			}
			return elem;
		},

		getElementById : function(id){
			return document.getElementById(id);
		},
		
		getElementsByTagName : function(tagName){
			return document.getElementsByTagName(tagName);
		},

		getElementsByClassName : function (className, tag){
			var elms = ((!tag || tag == "*") && this.all)? this.all : this.getElementsByTagName(tag || "*");
			var returnElms = [];
			var className = className.replace(/\-/g, "\\-");
			var regExp = new RegExp("(^|\\s)" + className + "(\\s|$)");
			var elm;
			for(var i=0; i<elms.length; i++){
				elm = elms[i];		
				if(regExp.test(elm.className)){
					returnElms.push(elm);
				}
			}
			return (returnElms);
		},

		getElementsByAttribute : function (attr, attrVal, tag){
			var elms = ((!tag || tag == "*") && this.all)? this.all : this.getElementsByTagName(tag || "*");
			var returnElms = [];
			if(typeof attrVal != "undefined"){
				var attrVal = new RegExp("(^|\\s)" + attrVal + "(\\s|$)");
			}
			var current;
			var currentAttr;
			for(var i = 0; i < elms.length; i++){
				current = elms[i];
				currentAttr = current.getAttribute(attr);
				if(typeof currentAttr == "string" && currentAttr.length > 0){	
					if(typeof attrVal == "undefined" || (attrVal && attrVal.test(currentAttr))){
						returnElms.push(current);
					}
				}
			}
			return returnElms;
		},

		getChildNodes : function(node){
			var childs = [];
			for(var i = 0 , iLen = node.childNodes.length; i < iLen ; i++){
				if(node.childNodes[i].nodeType == 1){
					childs.push(node.childNodes[i]);
				}
			}
			return childs;
		},
		
		getFirstChild : function(node){
			if(node.nodeType == 1){
				return node.firstChild;
			}else{
				return null;
			}
		},
		
		getLastChild : function(node){
			if(node.nodeType == 1){
				return node.lastChild;
			}else{
				return null;
			}			
		},
		
		getParentNode : function(node){
			return node.parentNode;
		},
		
		getOffsetParent : function(node){
			return node.offsetParent;
		},

		previousSibling : function(node){
			var prevSib = node.previousSibling;
			while(prevSib && prevSib.nodeType != 1){
				prevSib = prevSib.previousSibling;
			}
			return prevSib;	
		},

		nextSibling : function(node){
			var nextSib = node.nextSibling;
			while(nextSib && nextSib.nodeType != 1){
				nextSib = nextSib.nextSibling;
			}
			return nextSib;
		},
		/*
		/*相对于文档顶部的位置 *
		getPostion : function(element){
			var position = {x : 0, y: 0};
			if(element.offsetParent){
				do{
					position.x += element.offsetLeft;
					position.y += element.offsetTop;
				}while(element = element.offsetParent);
			}
			return position;
		},
*/
////////////////////////////////////////////////////insert , replace , remove , get , set  
		prepend : function(content ,node){
			var retVal = null;
			if(typeof content == "string"){
				retVal = node.innerHTML = content + node.innerHTML;
			}else{
				if(parentNode.firstChild){
					retVal = node.insertBefore(content, node.firstChild);
				}else{
					retVal = node.appendChild(content);
				}
			}
			return 	retVal;
		},

		append : function(content/*or html*/ , node){
			var retVal = null;
			if(typeof content == "string"){
				retVal = node.innerHTML += content;
			}
			else{
				retVal = node.appendChild(content);
			}
			return retVal;
		},

		insertAfter : function(content , node){
			if(typeof content == "string"){
				var  fragment = document.createDocumentFragment();
				fragment.innerHTML = content;
				content = fragment;
			}
			if(node.parentNode.lastChild == node)
				node.parentNode.appendChild(content);
			else
				node.parentNode.insertBefore(content , node.nextSibling);
			return content;
		},

		insertBefore : function(content , node){
			if(typeof content == "string"){
				var  fragment = document.createDocumentFragment();
				fragment.innerHTML = newNode;
				content = fragment;
			}
			node.parentNode.insertBefore(content , node);
			return content;
		},

		replaceContent : function(newConent , referenceNode){
			if(typeof newContent == 'string'){
				referenceNode.innerHTML = newContent;
			}else{
				for(var i=(referenceNode.childNodes.length - 1); i>=0; i--){
					referenceNode.removeChild(referenceNode.childNodes[i]);
				}//innerHTML = "";
				fmes.Dom.append(newConent , referenceNode);
			}
			return referenceNode;
		},

		replace : function(content, oldNode){
			if(typeof content == "string"){
				var  fragment = document.createDocumentFragment();
				fragment.innerHTML = content;
				content = fragment;
			}
			oldNode.parentNode.replaceChild(content , oldNode);
		},

		remove : function(node){
			return node.parentNode.removeChild(node);;
		},
		
		removeChildren : function(parent) {
			if(!parent) return false;
			while (parent.firstChild) {
				 parent.removeChild(parent.firstChild);
			}
			return parent;
		},

		getAttribute : function(node ,attr){
			return node.getAttribute(attr);
		},
		
		hasAttribute : function(node , attr){
			if(node.hasAttribute){
				return node.hasAttribute(attr);
			}else{
				return node.getAttribute(attr) !== null;
			}
		},
		
		setAttribute : function(node , attributeName , attributeValue){
			//2 parameter (node , {})
			if(arguments.length == 2 && typeof arguments[1] == "object"){
				for(var i in arguments[1]){
					if(/class/i.test(i)){
						arguments[0].className = arguments[1][i];
					}else{
						arguments[0].setAttribute(i , arguments[1][i]);
					}
				}
			}else if(arguments.length == 3 && typeof arguments[1] == "string"){
				arguments[0].setAttribute(arguments[1] , arguments[2]);
			}else{
				return false;
			}
			return node;
		},

		removeAttribute : function(node , attributeName){
			node.removeAttribute(attributeName);
		},
		
		loadStyleSheet : function(url,media){
			media = media || 'screen';
			var link = document.createElement('LINK');
			link.setAttribute('rel','stylesheet');
			link.setAttribute('type','text/css');
			link.setAttribute('href',url);
			link.setAttribute('media',media);
			document.getElementsByTagName('head')[0].appendChild(link);			
		},

		removeStyleSheet : function(url,media){
			var styles = fmes.Dom.getStyleSheets(url,media);
			for(var i = 0 ; i < styles.length ; i++) {
				var node = styles[i].ownerNode || styles[i].owningElement;
				styles[i].disabled = true;
				node.parentNode.removeChild(node);
			}
		},

		getStyleSheets : function(url,media) {
			var sheets = [];
			for(var i = 0 ; i < document.styleSheets.length ; i++) {
				if (url &&  document.styleSheets[i].href.indexOf(url) == -1) { continue; }
				if(media) {
					media = media.replace(/,\s*/,',');
					var sheetMedia;
						
					if(document.styleSheets[i].media.mediaText) {
						// DOM mehtod
						sheetMedia = document.styleSheets[i].media.mediaText.replace(/,\s*/,',');
						// Safari adds an extra comma and space
						sheetMedia = sheetMedia.replace(/,\s*$/,'');
					} else {
						// MSIE
						sheetMedia = document.styleSheets[i].media.replace(/,\s*/,',');
					}
					// Skip it if the media don't match
					if (media != sheetMedia) { continue; }
				}
				sheets.push(document.styleSheets[i]);
			}
			return sheets;
		},

		loadScript : function(url , callback){
			var script = document.createElement("script")
				script.type = "text/javascript";
			
			if (script.readyState){ //IE
				script.onreadystatechange = function(){
					if (script.readyState == "loaded" || script.readyState == "complete"){
						script.onreadystatechange = null;
						callback();
					}
				};
			}else { //Others
				script.onload = function(){
					callback();
				};
			}
			script.src = url;
			document.getElementsByTagName("head")[0].appendChild(script);	
		},

		getViewportWidth : function(){
			return (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth; 	
		},

		getViewportHeight : function(){
			return (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
		},
		
		//opeara xhtml1-transitional.dtd bug
		getDocumentWidth : function(){
			var width = 0 , view_width = fmes.Doc.getViewportWidth();
				// Mozilla   
			if(window.innerWidth && window.scrollMaxX){
				width = window.innerWidth + window.scrollMaxX;
			}else if(document.body.scrollWidth > document.body.offsetWidth){
				// all but Mac
				width = document.body.scrollWidth;
			}else{
				// Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				width =  document.body.offsetWidth;
			}
			return width > view_width ? width : view_width;
		},

 		getDocumentHeight : function(){
			var height = 0 , view_height = fmes.Doc.getViewportHeight();
			if(window.innerHeight && window.scrollMaxY){
				height = window.innerHeight + window.scrollMaxY;
			}else if(document.body.scrollHeight > document.body.offsetHeight){
				height = document.body.scrollHeight;
			}else{
				height =  document.body.offsetHeight;
			}
			return height > view_height ? height : view_height;			
		},

		forbidSelect : function(ele){
			ele.onselectstart = function(){return false;};
			ele.style.MozUserSelect = 'none';
			return true;
		},
		
		allowSelect : function(ele){
			ele.onselectstart = function(){return true;};
			ele.style.MozUserSelect = '';
			return true;
		},

		getHTML : function(node){
			return node.innerHTML;
		},
		
		setHTML : function(node , text){
			if(typeof text == "string"){
				node.innerHTML = text;
			}
			return node;
		},

		getText : function(node){
			var childNodes = node.childNodes , text = '';
			for(var i = 0 , iLen = childNodes.length , node; i < iLen ; i++){
				node = childNodes[i];
				if(node.nodeType === 3){
					text += node.nodeValue;
				}else if(node.nodeType === 1){
					text += arguments.callee(node);
				}
			}
			return text;
		},

		setText : function(node , text){
			if(typeof text == "string"){
				node.innerHTML = fmes.String.escapeHTML(text);
			}
			return node;
		}
	};

	fmes.Css = {
		addClass : function(target,className){
			var currentClass = ' ' + target.className + ' ';
			if(currentClass.indexOf(' ' + className + ' ') <  0 ){
				if(target.className){
					target.className += (' ' + className);
				}else{
					target.className = className;
				}
			}
			return target;
		},

		removeClass : function(target,className){
			var classToRemove = new RegExp(("(^|\\s)" + className + "(\\s|$)"), "i");
			target.className = target.className.replace(classToRemove, "").replace(/^\s+|\s+$/g, "");
			return target;
		},

		hasClass : function(target , className){
			return new RegExp(("(^|\\s)" + className + "(\\s|$)"), "i").test(target.className);
		},
			
		getStyle : function(target ,cssRule){
			var cssVal = "";
			if(cssRule == 'opacity'){
				return fmes.Css.getOpacity(cssRule);
			}
			if(document.defaultView && document.defaultView.getComputedStyle){
				cssVal = document.defaultView.getComputedStyle(target, "").getPropertyValue(cssRule);
			}else if(target.currentStyle){
				if(cssRule == 'float'){
					cssRule = 'styleFloat';
				}
				cssVal = cssRule.replace(/\-(\w)/g, function (match, p1){
					return p1.toUpperCase();
				});
				cssVal = target.currentStyle[cssVal];
			}
			return cssVal;
		},
		
		/**
		*	arguments: {cssName:value , cssName2:value} , target
		*			   'cssName' , 'value' , target
		*               
		*/
		setStyle : function(target , css , cssVal){
			// target,{cssName:value , cssName2:value} 
			// target, 'cssName' , value  
			// target, "cssName:value;cssName2:value"  
			if(arguments.length == 2 && typeof arguments[1] == "string"){
				target.style.cssText += (';' + arguments[1]);
				if(fmes.String.include(arguments[1],'opacity')){//include方法为string扩展
					var opacity = arguments[1].match(/opacity:\s*(\d?\.?\d*)/)[1];
					fmes.Css.setOpacity(opacity , target);
				}
			}else if(arguments.length == 2 && typeof arguments[1] == "object"){
				for(var property in arguments[1]){
					if(property == 'opacity'){
						fmes.Css.setOpacity(target , css[property]);
					}else if(property == 'float'){
						var _float = target.style.styleFloat ? 'styleFloat' : 'cssFloat';
						target.style[_float] = arguments[1][property];
					}else{
						target.style[property] = arguments[1][property];
					}
				}
			}else if(arguments.length == 3){
				if(arguments[1] == 'opacity'){
					fmes.Css.setOpacity( target , arguments[2]);
				}else if(property == 'float'){
						var _float = target.style.styleFloat ? 'styleFloat' : 'cssFloat';
						target.style[_float] = arguments[2];
				}else{
					target.style[arguments[1]] = arguments[2];
				}
			}else{
				return false;
			}
			return target;
		},


		getWidth : function(target){
			var padding = {
				right : parseInt(fmes.Css.getStyle(target , 'padding-right')),
				left : parseInt(fmes.Css.getStyle(target , 'padding-left'))
			};
			return target.clientWidth - padding.left - padding.right;
		},
		
		setWidth : function(target , value){
			value = value + '';
			if(value.indexOf('px') != -1){
				fmes.Css.setStyle(target , 'width' , value);
			}else{
				fmes.Css.setStyle(target , 'width' , value + 'px');
			}
			return target;
		},

		getHeight : function(target){
			var padding = {
				top : parseInt(fmes.Css.getStyle(target , 'padding-top')),
				bottom : parseInt(fmes.Css.getStyle(target , 'padding-bottom'))
			};
			return target.clientHeight - padding.top - padding.bottom;
		},
		
		setHeight : function(target , value){
			value = value + '';
			if(value.indexOf('px') != -1){
				fmes.Css.setStyle(target , 'height' , value);
			}else{
				fmes.Css.setStyle(target , 'height' , value + 'px');
			}
			return target;		
		},
			
		getInnerWidth : function(target){
			return target.clientWidth;
		},

		getInnerHeight : function(target){
			return target.clientHeight;
		},
			
		getOuterWidth : function(target){
			return target.offsetWidth;
		},

		getOuterHeight : function(target){
			return target.offsetHeight;
		},
		
		//position
		// jquery 
		//	position : 对元素设置的top , left属性的值
		//	offset : 相对于offsetParent的值 , 包含了margin等值
		//defalut: 相对offsetParent
		//有一参数时可设置相对的parent
		getPosition : function(target){
			var top = fmes.Css.getStyle(target , 'top');
			var left = fmes.Css.getStyle(target , 'left');

			return { left : left == 'auto' ?  0 : parseInt(left) , 
					 top : top == 'auto' ?  0 : parseInt(left) };
		},

		setPosition : function(target , position){
			if(position.top){
				fmes.Css.setStyle(target , 'top' , position.top + 'px');
			}
			if(position.left){
				fmes.Css.setStyle(target , 'left' , position.left + 'px');				
			}
			return target;
		},

		getOffset : function(target,offsetAncestor){
			var offset = {top:0 , left:0};
			if(!offsetAncestor){
				offset.top = target.offsetTop;
				offset.left = target.offsetLeft;
			}else{
				do{
					offset.top += target.offsetTop;
					offset.Left += target.offsetLeft;
					if(target == offsetAncestor){
						break;
					}else{
						target = target.offsetParent;
					}
				}while(target);
			}
			return offset;
		},
		
		//{top:'' , left:''}
		//如果对象原先的position样式属性是static的话，会被改成relative来实现重定位。

		setOffset : function(target , position){
			var positionType = fmes.Css.getStyle(target , 'position');
			if(positionType == 'static'){
				fmes.Css.setStyle(target , 'position' , 'relative');
			}
			if(position.top){
				var marginTop = parseInt(fmes.Css.getOffset(target).top) - parseInt(fmes.Css.getPosition(target).top);
				fmes.Css.setStyle(target , 'top' , (position.top - marginTop) + 'px');
			}
			if(position.left){
				var marginLeft = fmes.Css.getOffset(target).left - fmes.Css.getPosition(target).left;
				fmes.Css.setStyle(target , 'left' , (position.left - marginLeft) + 'px');				
			}
		},

		getScrollLeft : function(target){
			if(target == document.body){
				return fmes.css.getPageScroll().left;
			}else{
				return target.scrollLeft;
			}
		},

		getScrollTop : function(target){
			if(target == document.body){
				return fmes.css.getPageScroll().top;
			}else{
				return target.scrollTop;
			}
		},
			
		setScrollLeft : function(target ,value){
			target.scrollLeft = value;
			return true;
		},

		setScrollTop : function(target , value){
			target.scrollTop = value;
			return true;
		},

		getOpacity : function(target){
			var opacity = "";
			if(document.defaultView && document.defaultView.getComputedStyle){
				opacity = document.defaultView.getComputedStyle(target, "").getPropertyValue('opacity') || 1.0;
			}else if(target.filters){
				if(target.filters.length > 0 && target.filters.alpha){
					opacity = target.filters.alpha.opacity / 100.0 || 1.0;
				}else{
					opacity = 1.0;
				}
			}
			return opacity;
		},

		setOpacity : function(target ,opacity){
			if(target.style.opacity != undefined){ 
				target.style.opacity = opacity;
			}else if(target.style.MozOpacity != undefined){
				target.style.MozOpacity = opacity;
			}else if(target.style.filter != undefined){
				target.style.filter = 'Alpha(opacity = '+(opacity*100)+')';
			}else{
				return false;
			}
			return opacity;
		},

		getPageScroll : function() 
		{ 
			var x, y; 
			if(window.pageYOffset) 
			{    // all except IE    
				y = window.pageYOffset;    
				x = window.pageXOffset; 
			} else if(document.documentElement && document.documentElement.scrollTop) 
			{    // IE 6 Strict    
				y = document.documentElement.scrollTop;    
				x = document.documentElement.scrollLeft; 
			} else if(document.body) {    // all other IE    
				y = document.body.scrollTop;    
				x = document.body.scrollLeft;   
			} 
			return {left:x, top:y};
		}
	};

	fmes.Event = (function(){
		var handleId = 1; //用于构造句柄唯一ID
		var isReady = false; //用于判断document是否已经加载完成
		var isReadyEventBinded = false;
		var readyHandlers = [];
		return {
			addListener : function(element , type , handle){
				if (element.addEventListener) {
					if(type === "mousewheel"){
						type = "DOMMouseScroll"
					}
					element.addEventListener(type, handle, false);
					// add the under code for removeAllEvent
					if (!element.__events__){
						element.__events__ = {};
					}
					var handlers = element.__events__[type];
					if(!handlers){//用一个[]数组存注册的名柄,因为删除事件的差异性,所以不是用{}
						handlers = element.__events__[type] = [];
					}
					handlers.push(handle);
				}else {
					if (!handle.__id__){
						handle.__id__ = handleId++;
					}
					if (!element.__events__){
						element.__events__ = {};
					}
					var handlers = element.__events__[type];
					if (!handlers) {
						handlers = element.__events__[type] = {};
						if (element["on" + type]){
							handlers[0] = element["on" + type];
						}
					}
					handlers[handle.__id__] = handle;
					element["on" + type] = _handleEvent;
				}

				function _handleEvent(event){
					//可在此处修补event在IE和W3C中的不同 
					event = fmes.Event.fixEvent(event);
					var handlers = this.__events__[event.type];
					for (var i in handlers){
						handlers[i].call(this,event);
					}
				}
			},

			removeListener : function(element , type , handle){
				if (element.removeEventListener) {
					if(handle){
						element.removeEventListener(type, handle, false);
					}else{
						//移除所有dom 事件
						//类联事件
						if(element.getAttribute("on" + type)){
							element.removeAttribute("on" + type);
						}
						//删除addEventListener事件中的绑定
						if(type === "mousewheel"){
							type = "DOMMouseScroll";
						}
						if(element.__events__ && element.__events__[type]){
							var handlers = element.__events__[type];
							for(var i = 0 , len = handlers.length ; i < len ; i++){
								element.removeEventListener(type, handlers[i], false);
							}
						}
					}
				}else{
					// delete the event handler from the hash table
					if(element.__events__ && element.__events__[type]){
						if(handle){
							delete element.__events__[type][handle.__id__];
						}else{
							for(var handleID in element.__events__[type]){
								delete element.__events__[type][handleID];
							}
						}
					}else{//在没用到 fmes.addListener注册事件时element.__events__不存在,内联的注册事件在此remove
						if (element["on" + type]){
							element["on" + type] = null;
						}
					}
				}
			},
			
			dispatchEvent : function(element,event){
				if (document.createEventObject){
					// dispatch for IE
					var evt = document.createEventObject();
					return element.fireEvent('on'+event,evt);
				}else{
				// dispatch for firefox + others
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent(event, true, true ); // event type,bubbling,cancelable
					return !element.dispatchEvent(evt);
				}
			},
			
			delegate : function(delegateElement , selector,  type , handle){
				var Event = fmes.Event , Selector = fmes.Selector , Util = fmes.Util;
					if(typeof delegateElement === 'string'){
						delegateElement = Selector(delegateElement);
					}else if(typeof delegateElement === 'array'){
						delegateElement = delegateElement;
					}else{
						delegateElement = [delegateElement];
					}
					
					Util.each(delegateElement , function(){
						Event.addListener(this , type , function(e){
							var elems = Selector(selector , this);//找到所有需要被代理元素
							var target = e.target;
							Util.each(elems , function(){
								if(this === target){
									handle.call(this, handle);
								};
							});
						});
					});
			},
			
			undelegate : function(delegateElement , type , handle){
				var Event = fmes.Event , Selector = fmes.Selector , Util = fmes.Util;
				if(typeof delegateElement === 'string'){
					delegateElement = Selector(delegateElement);
				}else if(typeof delegateElement === 'array'){
					delegateElement = delegateElement;
				}else{
					delegateElement = [delegateElement];
				}
				Util.each(delegateElement , function(){
					Event.removeListener(this , type , handle);
				});
			},
			
			// window.onload事件，在页面中存在图片的时候，要等到img加载完成才会执行onload，但有时候就是想要把这一些img进行hidden,所以有API有此方法。
			ready : function(handle){
				if(isReady){
					handle();
					return ;
				}else{
					readyHandlers.push(handle);
				}
				if(!isReadyEventBinded){
					readyEventRegister();
					isReadyEventBinded = true;
				}
				
				function fireReadyHandlers(){
					isReady = true;
					for(var i = 0 , iLen = readyHandlers.length ; i < iLen ; i++){
						readyHandlers[i]();
					}
					readyHandlers.length = 0; //清除引用
					return true;
				}

				function readyEventRegister(){
					if(document.addEventListener) {
						document.addEventListener("DOMContentLoaded", fireReadyHandlers, false);
					}else if(document.all){
						document.write('<script id="__ie_onload" defer src="javascript:void(0)"><\/script>');
						var script = document.getElementById("__ie_onload");
						script.onreadystatechange = function() {
							if (this.readyState == "complete") {
								fireReadyHandlers(); // call the onload handler
								this.onreadystatechange = null;
								this.parentNode.removeChild(this);
							}
						};
					}else if(/WebKit/i.test(navigator.userAgent)) { // sniff
						var _timer = setInterval(function() {
							if (/loaded|complete/.test(document.readyState)) {
								clearInterval(_timer);
								fireReadyHandlers(); // call the onload handler
							}
						}, 10);
					}else{
						window.onload = fireReadyHandlers;
					}
				}
			},

			fixEvent : function(event){
				// Fix target property, if necessary
				event = event || window.event;
				if ( !event.target ) {
					event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
				}
				// check if target is a textnode (safari)
				if ( event.target.nodeType === 3 ) {
					event.target = event.target.parentNode;
				}
				// Add relatedTarget, if necessary
				if ( !event.relatedTarget && event.fromElement ) {
					event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
				}
				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && event.clientX != null ) {
					var doc = document.documentElement, body = document.body;
					event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
					event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
				}
				// Add which for key events
				if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
					event.which = event.charCode || event.keyCode;
				}
				// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
				if ( !event.metaKey && event.ctrlKey ) {
					event.metaKey = event.ctrlKey;
				}
				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && event.button !== undefined ) {
					event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
				}		
				return event;
			},
			
			getTarget : function(event){
				event = event || window.event;
				var target = event.target || event.srcElement || document;
				if(target.nodeType === 3) {
					 target = node.parentNode;
				}
				return target; 
			},
			
			getRelatedTarget : function(event){
				event = event || window.event;
				if ( !event.relatedTarget && event.fromElement ) {
					event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
				}
				return event.relatedTarget;
			},
			
			getMouseDetail : function(event){
				event = event || window.event;
				if(event.wheelDelta){
				   return event.wheelDelta < 0 ? -1 : 1;
				}
				else if(event.detail){
				   return event.detail < 0 ? 1 : -1;
				}else{
					return false;
				}
			},

			getMouseButton : function(event){
				event = event || window.event;
				if ( !event.which && event.button !== undefined ) {
					event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
				}
				return event.which;
			},
			
			getMouseCoordsInDocument : function(event){
				event = event || window.event;
				var doc = document.documentElement, body = document.body;
				var x = event.pageX || (event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0));
				var y = event.pageY || (event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0));
				return {'x':x,'y':y};
			},
			
			preventDefault : function (event){
				if(event && event.preventDefault){
					event.preventDefault();
				}
				else{
					window.event.returnValue = false;
				}
			},

			cancelBubble : function (event){
				if(event && event.stopPropagation){
					event.stopPropagation();
				}
				else{
					window.event.cancelBubble = true;
				}
			}
		}
	})();

	fmes.Ajax = (function(){
		var _getRequest = function(){
			if(window.XMLHttpRequest){
				_getRequest = function(){
					return new window.XMLHttpRequest();
				}
				return new window.XMLHttpRequest(); 
			}else if (window.ActiveXObject){
				_getRequest = function(){
					return new window.ActiveXObject('Microsoft.XMLHTTP');
				}
				return new window.ActiveXObject('Microsoft.XMLHTTP');
			}
		};
		
		var _onStateChange = function(req , options){
	        if (!options.cache && options.method === 'GET') {  
	            options.url = [url, ( url.indexOf('?') == -1 ? '?' : '&') , "__=" , (new Date()).getTime()].join('');  
	        }
	        
			req.onreadystatechange = function(){
				switch (req.readyState){
					case 1:
						// Loading
						if(options.onLoading && typeof options.onLoading === 'function'){
							options.onLoading.call(req);
						}
						break;
					case 2:
						// Loaded
						if(options.onLoaded && typeof options.onLoaded === 'function'){
							options.onLoaded.call(req);
						}
						break;
					case 3:
						// Interactive
						if(options.onInteractive && typeof options.onInteractive === 'function'){
							options.onInteractive.call(req);
						}
						break;
					case 4:
						// Complete
							var contentType = req.getResponseHeader('Content-Type');
							var mimeType = contentType.match(/\s*([^;]+)\s*(;|$)/i)[1];
							if (req.status && req.status >= 200 && req.status < 300) {		
								switch(mimeType) {
			                        case 'text/xml':
			                        case 'application/xml':
			                        case 'application/xhtml+xml':
										if(options.onSuccess  && typeof options.onSuccess === 'function'){
											options.onSuccess.call(req , req.responseXML);
										}
										break;
			                        case 'application/json':
										var json = fmes.Util.stringToJson(req.responseText);
										if(options.onSuccess  && typeof options.onSuccess === 'function'){
											options.onSuccess.call(req , json);
										}
										break;
			                        case 'text/html':
										if(options.onSuccess  && typeof options.onSuccess === 'function'){
											options.onSuccess.call(req , req.responseText);
										}
										break;
									default : 
										if(options.onSuccess  && typeof options.onSuccess === 'function'){
											options.onSuccess.call(req , req.responseText);
										}										
										break;
								}
							}else{
								if(options.onError && typeof options.onError === 'function') {
									options.onError(req);
								}
							}
							// A after listener
							if(options.afterRequest && typeof options.afterRequest === 'function') {
								options.afterRequest.call(req);
							}
						break;
				}
			}//end of onreadystatechange
			req.open(options.method, options.url, options.async);
			if(options.header){
				for(var key in options.header){
					req.setRequestHeader( key , options.header[key]);
				}
			}
			return req;
		};

		return function(options){
			options.url = options.url || location.href;
			options.async = '' + options.async === 'false' ? false : true;  
            options.method  = options.method ? options.method.toUpperCase() : 'POST';
            options.data    = options.data      || null ;
            options.onSuccess = options.onSuccess   || null ;  
            options.onError = options.onError   || null ; 
            options.cache = '' + options.cache === 'false' ?  false : true;
			//options.timeout = options.timeout || 3000;
			
			var req = _getRequest();
				req = _onStateChange(req , options);
		    if ('GET' === options.method && options.data){  
		       url = [url, ( url.indexOf('?') == -1 ? '?' : '&') ,options.data].join('');  
		       options.data = null;  
		    }
			if(options.beforeRequest && typeof options.beforeRequest === 'function') {
				options.beforeRequest.call(req);
			}
			req.send(options.data);	
		};
	})();
	
	fmes.Form = (function(){
		var Util = fmes.Util;
		return {
			reset: function(form) {
				form.reset();
				return form;
			},
			
			submit : function(form){
				form.submit();
				return form;
			},
			
			getValue : function(element){
				var Element = fmes.Form.Element;
				return Element.value(element);
			},
			
			setValue : function(element , value){
				var Element = fmes.Form.Element;
				Element.value(element , value);
				return element;
			},
			
			serialize : function(form , flag){
				var Element = fmes.Form.Element;
				var elements = form.elements;
				var result = {};
				Util.each(elements, function(){
					var type = this.type ? this.type.toLowerCase() : undefine;
					var name = this.name;
					var value = Element.value(this);
					if( name && value && !this.disabled && type !== 'file' && type !== 'reset'){
						if(result[name]){
							if(Util.isArray(result[name])){
								result[name].push(value);
							}else{
								result[name] = [ result[name] , value ];
							}
						}else{
							result[name] = value;
						}
					}
				});
				return flag ? result : Util.jsonToQueryString(result);
			}
		} //end of return 
	})();
	
	fmes.Form.Element = (function(){
		var formElems = /textarea|input|select/i;
		var Util = fmes.Util;
		var Dom = fmes.Dom;
		var _Array = fmes.Array;
		
		function input(element, value) {
			 switch (element.type.toLowerCase()) {
			      case 'checkbox':
			      case 'radio':
			        return checkedSelector(element, value);
			      default:
			        return valueSelector(element, value);
			 }
		}

		function checkedSelector(element, value) {
			if (Util.isUndefined(value))
			   return element.checked ? element.value : null;
			 else element.checked = !!value;
		}

		function valueSelector(element, value) {
			 if (Util.isUndefined(value)){
				 return element.value;
			 }else{
				 element.value = value;
			 }
		}

		function select(element, value) {
			 if (Util.isUndefined(value))
			      return (element.type === 'select-one' ? getSelectOneValue : getSelectMultipleValue)(element);

			 var opt, currentValue, single = !Util.isArray(value);
			 for (var i = 0, length = element.length; i < length; i++) {
			      opt = element.options[i];
			      currentValue = optionValue(opt);
			      if (single) {
			        if (currentValue == value) {
			          opt.selected = true;
			          return;
			        }
			      }else{
			    	  opt.selected = _Array.include(value,currentValue);
			      }
			 }
		}

		function getSelectOneValue(element) {
			 var index = element.selectedIndex;
			 return index >= 0 ? optionValue(element.options[index]) : null;
		}

		function getSelectMultipleValue(element) {
			 var values, length = element.length;
			 if (!length) return null;

			 for (var i = 0, values = []; i < length; i++) {
			      var opt = element.options[i];
			      if (opt.selected){
			    	  values.push(optionValue(opt));
			      }
			 }
			 return values;
		}

		function optionValue(opt) {
			 return Dom.hasAttribute(opt ,'value') ? opt.value : opt.text;
		}
		
		return {
				//取得元素的值或给元素设置值
				value : function(element , value){
					var nodeName = element.nodeName.toLowerCase();
					if(!formElems.test(nodeName)){
						return ;
					}
					switch(nodeName){
						case 'input':
							return input(element , value);
						case 'select':
							return select(element , value);
						case 'textarea':
							if(Util.isUndefined(value)){
								return element.value;
							}else{
								element.value = value;
							}
						default :
							return ;
					}
				}
			};
	})();
	
	fmes.Cookie = {
		get: function(name){
			var cookie = document.cookie;
			if(!name){
				return cookie;
			}
			var arrCookie = cookie.split("; "); 
			for(var i = 0; i < arrCookie.length ; i++){ 
				var arr=arrCookie[i].split("="); 
				if( arr[0] == name ){
					return decodeURIComponent(arr[1]);
				}
			}
			return '';
		},
		
		set: function(name , value , hour , domain , path){
			var cookie = name + "=" + encodeURIComponent(value);
			if( hour > 0 ){
				var date=new Date();
				date.setTime( date.getTime() + hour*60*60*1000); 
				cookie = cookie+"; expires=" + date.toGMTString();
			}
			if(domain){
				cookie = cookie + "; domain=" + domain;
			}
			if(path){
				cookie = cookie + "; path=" + path;
			}
			document.cookie = cookie;		
		},
		
		remove : function(name){
			var date = new Date();
				date.setTime( date.getTime() - 10000); 
			document.cookie = name + "=; expires=" + date.toGMTString();
			return true;
		},
		
		clear : function(){
			var cookie = document.cookie;
			var arrCookie = cookie.split("; "); 
			for(var i = 0 , iLen = arrCookie.length; i < iLen ; i++){ 
				var arr = arrCookie[i].split("=");
				fmes.Cookie.remove(arr[0]);
			}
			return true;
		}
	};

	fmes.String = {
		trim : function(string) {
			return string.replace(/^\s+/, '').replace(/\s+$/, '');
		},
		
		trimStart : function(string){
			return string.replace(/^\s+/, '');
		},
		
		trimEnd : function(string){
			return string.replace(/\s+$/,'');
		},

		isEmpty : function(string){
			return string == '';
		},

		isBlank : function(string){
			return /^\s*$/.test(string);
		},

		include: function(string,pattern) {
			return string.indexOf(pattern) > -1;
		},

		startsWith: function(string , pattern) {
			return string.indexOf(pattern) === 0;
		},

		endsWith : function(string , pattern) {
			var d = string.length - pattern.length;
			return d >= 0 && string.lastIndexOf(pattern) === d;
		},
		
		toCharArray : function(string){
			return string.split('');
		},

		camelize : function(string){
			return string.replace(/-+(.)?/g, function(match, chr) {
				return chr ? chr.toUpperCase() : '';
			});
		},

		uncamelize : function(string, sep) {
			sep = sep || '-';
			return string.replace(/([a-z])([A-Z])/g, function (strMatch, p1, p2){
				return p1 + sep + p2.toLowerCase();
			});
		},

		capitalize : function(string){
			return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
		},

		truncate : function(string , length, truncation) {
			length = length || 30;
			truncation = truncation ? truncation : '...';
			return string.length > length ? string.slice(0, length - truncation.length) + truncation : string;
		},
		
		escapeHTML : function(string){
		    return string.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		},
		
		unescapeHTML : function(string){
		    return string.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
		}
	};

	fmes.Class = {
		/**
		 * @param config { import , extend , implements, constructor ,  methods , statics ,augments}
		 **/
		define : function( namespace , config){
			if(!namespace){
				throw new Error('fmes.Class.define: class name is null.');
			}
			
			config.extend = config.extend || null;
			config.constructor = config.constructor || function(){};
			config.methods = config.methods || {};
			config.statics = config.statics || {};
			config.augments = config.augments || [];
			registerNamespace(namespace);
			
			var Class = fmes.Class;
			if(config.extend){
				if( typeof config.extend === 'string'){
					config.extend = getNamespaceFromString(config.extend);
					if(config.extend){
						Class.extend(namespace , config.extend);
					}else{
						throw new Error('fmes.Class.define: extend from a invalid Class');
					}
				}else{
					Class.extend(namespace , config.extend);
				}
			}
			
			if(config.methods && typeof config.methods === 'object'){
				Class.addMethods(namespace , config.methods);
			}
			
			if(config.statics && typeof config.statics === 'object'){
				for(var i in config.statics){
					namespace[i] = config.statics[i];
				}
			}
			
			if(typeof config.augments === 'array'){
				fmes.Util.each(config.augments , function(i,elem){
					if(typeof elem === 'string'){
						elem = getNamespaceFromString(elem);
					}
					Class.augments(namespace , elem)
				});
			}
			
			function registerNamespace(namespaceStr){
				var _String = fmes.String;
				var array = namespaceStr.split('.');
					array = array.length > 0 ? array : [namespaceStr];
					
				for(var i = 0 , iLen = array.length , scope; i < iLen ; i++){
						scope = _String.trim(array[i]);
						if( i == 0 ){
							namespace = window[scope] ? window[scope] : window[scope] = {};	
						}else if( i == iLen -1 ){
							namespace = namespace[scope] = config.constructor;
						}else{
							namespace = namespace[scope] ? namespace[scope] : namespace[scope] = {};
						}
				}
			}
			
			//从一个命名空间字符串解析出对象
			function getNamespaceFromString(namespaceStr){
				var _String = fmes.String , namespace = null , array = namespaceStr.split('.');	
				array = array.length > 0 ? array : [namespaceStr];
				
				for(var i = 0 , iLen = array.length ,scope; i < iLen ; i++){
					scope = _String.trim(array[i]);
					if( i == 0 ){
						if(window[scope]){
							namespace = window[scope] ;
						}else{
							return null;
						}
					}else{
						if(namespace[scope]){
							namespace = namespace[scope]
						}else{
							return null;
						}
					}
				}
				return namespace;
			}
		},

		extend : function(subClass , superClass){
		  var F = function() {};
		  F.prototype = superClass.prototype;
		  subClass.prototype = new F();
		  subClass.prototype.constructor = subClass;

		  subClass.prototype.superClass = superClass.prototype;
		  if(superClass.prototype.constructor == Object.prototype.constructor){
			superClass.prototype.constructor = superClass;
		  }
		},

		clone : function(object) {
			function F() {}
			F.prototype = object;
			return new F;
		},
		
		//参元类
		augments : function(receivingClass , givingClass){
		  if(arguments[2]) {
			for(var i = 2, len = arguments.length; i < len; i++) {
			  receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
			}
		  } 
		  else {
			for(methodName in givingClass.prototype) { 
			  if(!receivingClass.prototype[methodName]) {
				receivingClass.prototype[methodName] = givingClass.prototype[methodName];
			  }
			}
		  }
		},
		
		addMethods : function(_class){
			if(arguments.length < 2){
				return _class;
			}
			for(var i = 1 , len = arguments.length ; i < len ; i ++ ){
				for(var method in arguments[i]){
					if(_class.prototype[method]){
						continue;
					}
					_class.prototype[method] = arguments[i][method];
				}
			}
			return _class;
		}
	};

	fmes.Interface = function(){
	    if(arguments.length != 2) {
	        throw new Error("Interface constructor called with " + arguments.length
	          + "arguments, but expected exactly 2.");
	    }
	    
	    this.name = name;
	    this.methods = [];
	    for(var i = 0, len = methods.length; i < len; i++) {
	        if(typeof methods[i] !== 'string') {
	            throw new Error("Interface constructor expects method names to be " 
	              + "passed in as a string.");
	        }
	        this.methods.push(methods[i]);        
	    }
	};
	
	// Static class method.
	fmes.Interface.ensureImplements = function(object) {
	    if(arguments.length < 2) {
	        throw new Error("Function Interface.ensureImplements called with " + 
	          arguments.length  + "arguments, but expected at least 2.");
	    }

	    for(var i = 1, len = arguments.length; i < len; i++) {
	        var interface = arguments[i];
	        if(interface.constructor !== fmes.Interface) {
	            throw new Error("Function fmes.Interface.ensureImplements expects arguments "   
	              + "two and above to be instances of Interface.");
	        }
	        
	        for(var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
	            var method = interface.methods[j];
	            if(!object[method] || typeof object[method] !== 'function') {
	                throw new Error("Function Interface.ensureImplements: object " 
	                  + "does not implement the " + interface.name 
	                  + " interface. Method " + method + " was not found.");
	            }
	        }
	    } 
	};
	/*
	 *json.js
	 * https://github.com/douglascrockford/JSON-js/blob/master/json.js#L200
	 **/
	(function () {
		var JSON = {};
	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }
	    if (typeof Date.prototype.toJSON !== 'function') {
	        Date.prototype.toJSON = function (key) {
	            return isFinite(this.valueOf()) ?
	                this.getUTCFullYear()     + '-' +
	                f(this.getUTCMonth() + 1) + '-' +
	                f(this.getUTCDate())      + 'T' +
	                f(this.getUTCHours())     + ':' +
	                f(this.getUTCMinutes())   + ':' +
	                f(this.getUTCSeconds())   + 'Z' : null;
	        };

	        String.prototype.toJSON      =
	            Number.prototype.toJSON  =
	            Boolean.prototype.toJSON = function (key) {
	                return this.valueOf();
	            };
	    }

	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;

	    function quote(string) {
	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string' ? c :
	                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }


	    function str(key, holder) {
	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];

	        if (value && typeof value === 'object' &&
	                typeof value.toJSON === 'function') {
	            value = value.toJSON(key);
	        }

	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }

	        switch (typeof value) {
	        case 'string':
	            return quote(value);
	        case 'number':
	            return isFinite(value) ? String(value) : 'null';
	        case 'boolean':
	        case 'null':
	            return String(value);
	        case 'object':
	            if (!value) {
	                return 'null';
	            }
	            gap += indent;
	            partial = [];
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	                v = partial.length === 0 ? '[]' : gap ?
	                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
	                    '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }

	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    k = rep[i];
	                    if (typeof k === 'string') {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {

	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	            v = partial.length === 0 ? '{}' : gap ?
	                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
	                '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }

	    if (typeof JSON.stringify !== 'function') {
	        JSON.stringify = function (value, replacer, space) {
	            var i;
	            gap = '';
	            indent = '';
	            if (typeof space === 'number') {
	                for (i = 0; i < space; i += 1) {
	                    indent += ' ';
	                }
	            } else if (typeof space === 'string') {
	                indent = space;
	            }

	            rep = replacer;
	            if (replacer && typeof replacer !== 'function' &&
	                    (typeof replacer !== 'object' ||
	                    typeof replacer.length !== 'number')) {
	                throw new Error('JSON.stringify');
	            }

	            return str('', {'': value});
	        };
	    }

	    if (typeof JSON.parse !== 'function') {
	        JSON.parse = function (text, reviver) {
	            var j;
	            function walk(holder, key) {
	                var k, v, value = holder[key];
	                if (value && typeof value === 'object') {
	                    for (k in value) {
	                        if (Object.prototype.hasOwnProperty.call(value, k)) {
	                            v = walk(value, k);
	                            if (v !== undefined) {
	                                value[k] = v;
	                            } else {
	                                delete value[k];
	                            }
	                        }
	                    }
	                }
	                return reviver.call(holder, key, value);
	            }

	            text = String(text);
	            cx.lastIndex = 0;
	            if (cx.test(text)) {
	                text = text.replace(cx, function (a) {
	                    return '\\u' +
	                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                });
	            }
	            if (/^[\],:{}\s]*$/
	                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	                j = eval('(' + text + ')');
	                return typeof reviver === 'function' ?
	                    walk({'': j}, '') : j;
	            }
	            throw new SyntaxError('JSON.parse');
	        };
	    }

	    fmes.Util.jsonToString = function (json , filter) {
	        return JSON.stringify(json, filter);
	    };
	}());
	
	/*!
	 * Sizzle CSS Selector Engine
	 *  Copyright 2011, The Dojo Foundation
	 *  Released under the MIT, BSD, and GPL Licenses.
	 *  More information: http://sizzlejs.com/
	 */
(function(){
	var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
		expando = "sizcache" + (Math.random() + '').replace('.', ''),
		done = 0,
		toString = Object.prototype.toString,
		hasDuplicate = false,
		baseHasDuplicate = true,
		rBackslash = /\\/g,
		rReturn = /\r\n/g,
		rNonWord = /\W/;

	// Here we check if the JavaScript engine is using some sort of
	// optimization where it does not always call our comparision
	// function. If that is the case, discard the hasDuplicate value.
	//   Thus far that includes Google Chrome.
	[0, 0].sort(function() {
		baseHasDuplicate = false;
		return 0;
	});

	var Sizzle = function( selector, context, results, seed ) {
		results = results || [];
		context = context || document;

		var origContext = context;

		if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
			return [];
		}
		
		if ( !selector || typeof selector !== "string" ) {
			return results;
		}

		var m, set, checkSet, extra, ret, cur, pop, i,
			prune = true,
			contextXML = Sizzle.isXML( context ),
			parts = [],
			soFar = selector;
		
		// Reset the position of the chunker regexp (start from head)
		do {
			chunker.exec( "" );
			m = chunker.exec( soFar );

			if ( m ) {
				soFar = m[3];
			
				parts.push( m[1] );
			
				if ( m[2] ) {
					extra = m[3];
					break;
				}
			}
		} while ( m );

		if ( parts.length > 1 && origPOS.exec( selector ) ) {

			if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
				set = posProcess( parts[0] + parts[1], context, seed );

			} else {
				set = Expr.relative[ parts[0] ] ?
					[ context ] :
					Sizzle( parts.shift(), context );

				while ( parts.length ) {
					selector = parts.shift();

					if ( Expr.relative[ selector ] ) {
						selector += parts.shift();
					}
					
					set = posProcess( selector, set, seed );
				}
			}

		} else {
			// Take a shortcut and set the context if the root selector is an ID
			// (but not if it'll be faster if the inner selector is an ID)
			if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
					Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

				ret = Sizzle.find( parts.shift(), context, contextXML );
				context = ret.expr ?
					Sizzle.filter( ret.expr, ret.set )[0] :
					ret.set[0];
			}

			if ( context ) {
				ret = seed ?
					{ expr: parts.pop(), set: makeArray(seed) } :
					Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

				set = ret.expr ?
					Sizzle.filter( ret.expr, ret.set ) :
					ret.set;

				if ( parts.length > 0 ) {
					checkSet = makeArray( set );

				} else {
					prune = false;
				}

				while ( parts.length ) {
					cur = parts.pop();
					pop = cur;

					if ( !Expr.relative[ cur ] ) {
						cur = "";
					} else {
						pop = parts.pop();
					}

					if ( pop == null ) {
						pop = context;
					}

					Expr.relative[ cur ]( checkSet, pop, contextXML );
				}

			} else {
				checkSet = parts = [];
			}
		}

		if ( !checkSet ) {
			checkSet = set;
		}

		if ( !checkSet ) {
			Sizzle.error( cur || selector );
		}

		if ( toString.call(checkSet) === "[object Array]" ) {
			if ( !prune ) {
				results.push.apply( results, checkSet );

			} else if ( context && context.nodeType === 1 ) {
				for ( i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
						results.push( set[i] );
					}
				}

			} else {
				for ( i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
						results.push( set[i] );
					}
				}
			}

		} else {
			makeArray( checkSet, results );
		}

		if ( extra ) {
			Sizzle( extra, origContext, results, seed );
			Sizzle.uniqueSort( results );
		}

		return results;
	};

	Sizzle.uniqueSort = function( results ) {
		if ( sortOrder ) {
			hasDuplicate = baseHasDuplicate;
			results.sort( sortOrder );

			if ( hasDuplicate ) {
				for ( var i = 1; i < results.length; i++ ) {
					if ( results[i] === results[ i - 1 ] ) {
						results.splice( i--, 1 );
					}
				}
			}
		}

		return results;
	};

	Sizzle.matches = function( expr, set ) {
		return Sizzle( expr, null, null, set );
	};

	Sizzle.matchesSelector = function( node, expr ) {
		return Sizzle( expr, null, null, [node] ).length > 0;
	};

	Sizzle.find = function( expr, context, isXML ) {
		var set, i, len, match, type, left;

		if ( !expr ) {
			return [];
		}

		for ( i = 0, len = Expr.order.length; i < len; i++ ) {
			type = Expr.order[i];
			
			if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
				left = match[1];
				match.splice( 1, 1 );

				if ( left.substr( left.length - 1 ) !== "\\" ) {
					match[1] = (match[1] || "").replace( rBackslash, "" );
					set = Expr.find[ type ]( match, context, isXML );

					if ( set != null ) {
						expr = expr.replace( Expr.match[ type ], "" );
						break;
					}
				}
			}
		}

		if ( !set ) {
			set = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( "*" ) :
				[];
		}

		return { set: set, expr: expr };
	};

	Sizzle.filter = function( expr, set, inplace, not ) {
		var match, anyFound,
			type, found, item, filter, left,
			i, pass,
			old = expr,
			result = [],
			curLoop = set,
			isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

		while ( expr && set.length ) {
			for ( type in Expr.filter ) {
				if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
					filter = Expr.filter[ type ];
					left = match[1];

					anyFound = false;

					match.splice(1,1);

					if ( left.substr( left.length - 1 ) === "\\" ) {
						continue;
					}

					if ( curLoop === result ) {
						result = [];
					}

					if ( Expr.preFilter[ type ] ) {
						match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

						if ( !match ) {
							anyFound = found = true;

						} else if ( match === true ) {
							continue;
						}
					}

					if ( match ) {
						for ( i = 0; (item = curLoop[i]) != null; i++ ) {
							if ( item ) {
								found = filter( item, match, i, curLoop );
								pass = not ^ found;

								if ( inplace && found != null ) {
									if ( pass ) {
										anyFound = true;

									} else {
										curLoop[i] = false;
									}

								} else if ( pass ) {
									result.push( item );
									anyFound = true;
								}
							}
						}
					}

					if ( found !== undefined ) {
						if ( !inplace ) {
							curLoop = result;
						}

						expr = expr.replace( Expr.match[ type ], "" );

						if ( !anyFound ) {
							return [];
						}

						break;
					}
				}
			}

			// Improper expression
			if ( expr === old ) {
				if ( anyFound == null ) {
					Sizzle.error( expr );

				} else {
					break;
				}
			}

			old = expr;
		}

		return curLoop;
	};

	Sizzle.error = function( msg ) {
		throw "Syntax error, unrecognized expression: " + msg;
	};

	/**
	 * Utility function for retreiving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	var getText = Sizzle.getText = function( elem ) {
		var i, node,
			nodeType = elem.nodeType,
			ret = "";

		if ( nodeType ) {
			if ( nodeType === 1 ) {
				// Use textContent || innerText for elements
				if ( typeof elem.textContent === 'string' ) {
					return elem.textContent;
				} else if ( typeof elem.innerText === 'string' ) {
					// Replace IE's carriage returns
					return elem.innerText.replace( rReturn, '' );
				} else {
					// Traverse it's children
					for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
						ret += getText( elem );
					}
				}
			} else if ( nodeType === 3 || nodeType === 4 ) {
				return elem.nodeValue;
			}
		} else {

			// If no nodeType, this is expected to be an array
			for ( i = 0; (node = elem[i]); i++ ) {
				// Do not traverse comment nodes
				if ( node.nodeType !== 8 ) {
					ret += getText( node );
				}
			}
		}
		return ret;
	};

	var Expr = Sizzle.selectors = {
		order: [ "ID", "NAME", "TAG" ],

		match: {
			ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
			ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
			TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
			CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
			POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
			PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
		},

		leftMatch: {},

		attrMap: {
			"class": "className",
			"for": "htmlFor"
		},

		attrHandle: {
			href: function( elem ) {
				return elem.getAttribute( "href" );
			},
			type: function( elem ) {
				return elem.getAttribute( "type" );
			}
		},

		relative: {
			"+": function(checkSet, part){
				var isPartStr = typeof part === "string",
					isTag = isPartStr && !rNonWord.test( part ),
					isPartStrNotTag = isPartStr && !isTag;

				if ( isTag ) {
					part = part.toLowerCase();
				}

				for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
					if ( (elem = checkSet[i]) ) {
						while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

						checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
							elem || false :
							elem === part;
					}
				}

				if ( isPartStrNotTag ) {
					Sizzle.filter( part, checkSet, true );
				}
			},

			">": function( checkSet, part ) {
				var elem,
					isPartStr = typeof part === "string",
					i = 0,
					l = checkSet.length;

				if ( isPartStr && !rNonWord.test( part ) ) {
					part = part.toLowerCase();

					for ( ; i < l; i++ ) {
						elem = checkSet[i];

						if ( elem ) {
							var parent = elem.parentNode;
							checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
						}
					}

				} else {
					for ( ; i < l; i++ ) {
						elem = checkSet[i];

						if ( elem ) {
							checkSet[i] = isPartStr ?
								elem.parentNode :
								elem.parentNode === part;
						}
					}

					if ( isPartStr ) {
						Sizzle.filter( part, checkSet, true );
					}
				}
			},

			"": function(checkSet, part, isXML){
				var nodeCheck,
					doneName = done++,
					checkFn = dirCheck;

				if ( typeof part === "string" && !rNonWord.test( part ) ) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}

				checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
			},

			"~": function( checkSet, part, isXML ) {
				var nodeCheck,
					doneName = done++,
					checkFn = dirCheck;

				if ( typeof part === "string" && !rNonWord.test( part ) ) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}

				checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
			}
		},

		find: {
			ID: function( match, context, isXML ) {
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			},

			NAME: function( match, context ) {
				if ( typeof context.getElementsByName !== "undefined" ) {
					var ret = [],
						results = context.getElementsByName( match[1] );

					for ( var i = 0, l = results.length; i < l; i++ ) {
						if ( results[i].getAttribute("name") === match[1] ) {
							ret.push( results[i] );
						}
					}

					return ret.length === 0 ? null : ret;
				}
			},

			TAG: function( match, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( match[1] );
				}
			}
		},
		preFilter: {
			CLASS: function( match, curLoop, inplace, result, not, isXML ) {
				match = " " + match[1].replace( rBackslash, "" ) + " ";

				if ( isXML ) {
					return match;
				}

				for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
					if ( elem ) {
						if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
							if ( !inplace ) {
								result.push( elem );
							}

						} else if ( inplace ) {
							curLoop[i] = false;
						}
					}
				}

				return false;
			},

			ID: function( match ) {
				return match[1].replace( rBackslash, "" );
			},

			TAG: function( match, curLoop ) {
				return match[1].replace( rBackslash, "" ).toLowerCase();
			},

			CHILD: function( match ) {
				if ( match[1] === "nth" ) {
					if ( !match[2] ) {
						Sizzle.error( match[0] );
					}

					match[2] = match[2].replace(/^\+|\s*/g, '');

					// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
					var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
						match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
						!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

					// calculate the numbers (first)n+(last) including if they are negative
					match[2] = (test[1] + (test[2] || 1)) - 0;
					match[3] = test[3] - 0;
				}
				else if ( match[2] ) {
					Sizzle.error( match[0] );
				}

				// TODO: Move to normal caching system
				match[0] = done++;

				return match;
			},

			ATTR: function( match, curLoop, inplace, result, not, isXML ) {
				var name = match[1] = match[1].replace( rBackslash, "" );
				
				if ( !isXML && Expr.attrMap[name] ) {
					match[1] = Expr.attrMap[name];
				}

				// Handle if an un-quoted value was used
				match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

				if ( match[2] === "~=" ) {
					match[4] = " " + match[4] + " ";
				}

				return match;
			},

			PSEUDO: function( match, curLoop, inplace, result, not ) {
				if ( match[1] === "not" ) {
					// If we're dealing with a complex expression, or a simple one
					if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
						match[3] = Sizzle(match[3], null, null, curLoop);

					} else {
						var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

						if ( !inplace ) {
							result.push.apply( result, ret );
						}

						return false;
					}

				} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
					return true;
				}
				
				return match;
			},

			POS: function( match ) {
				match.unshift( true );

				return match;
			}
		},
		
		filters: {
			enabled: function( elem ) {
				return elem.disabled === false && elem.type !== "hidden";
			},

			disabled: function( elem ) {
				return elem.disabled === true;
			},

			checked: function( elem ) {
				return elem.checked === true;
			},
			
			selected: function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}
				
				return elem.selected === true;
			},

			parent: function( elem ) {
				return !!elem.firstChild;
			},

			empty: function( elem ) {
				return !elem.firstChild;
			},

			has: function( elem, i, match ) {
				return !!Sizzle( match[3], elem ).length;
			},

			header: function( elem ) {
				return (/h\d/i).test( elem.nodeName );
			},

			text: function( elem ) {
				var attr = elem.getAttribute( "type" ), type = elem.type;
				// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
				// use getAttribute instead to test this case
				return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
			},

			radio: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
			},

			checkbox: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
			},

			file: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
			},

			password: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
			},

			submit: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "submit" === elem.type;
			},

			image: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
			},

			reset: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "reset" === elem.type;
			},

			button: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && "button" === elem.type || name === "button";
			},

			input: function( elem ) {
				return (/input|select|textarea|button/i).test( elem.nodeName );
			},

			focus: function( elem ) {
				return elem === elem.ownerDocument.activeElement;
			}
		},
		setFilters: {
			first: function( elem, i ) {
				return i === 0;
			},

			last: function( elem, i, match, array ) {
				return i === array.length - 1;
			},

			even: function( elem, i ) {
				return i % 2 === 0;
			},

			odd: function( elem, i ) {
				return i % 2 === 1;
			},

			lt: function( elem, i, match ) {
				return i < match[3] - 0;
			},

			gt: function( elem, i, match ) {
				return i > match[3] - 0;
			},

			nth: function( elem, i, match ) {
				return match[3] - 0 === i;
			},

			eq: function( elem, i, match ) {
				return match[3] - 0 === i;
			}
		},
		filter: {
			PSEUDO: function( elem, match, i, array ) {
				var name = match[1],
					filter = Expr.filters[ name ];

				if ( filter ) {
					return filter( elem, i, match, array );

				} else if ( name === "contains" ) {
					return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

				} else if ( name === "not" ) {
					var not = match[3];

					for ( var j = 0, l = not.length; j < l; j++ ) {
						if ( not[j] === elem ) {
							return false;
						}
					}

					return true;

				} else {
					Sizzle.error( name );
				}
			},

			CHILD: function( elem, match ) {
				var first, last,
					doneName, parent, cache,
					count, diff,
					type = match[1],
					node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) )	 {
							if ( node.nodeType === 1 ) { 
								return false; 
							}
						}

						if ( type === "first" ) { 
							return true; 
						}

						node = elem;

					case "last":
						while ( (node = node.nextSibling) )	 {
							if ( node.nodeType === 1 ) { 
								return false; 
							}
						}

						return true;

					case "nth":
						first = match[2];
						last = match[3];

						if ( first === 1 && last === 0 ) {
							return true;
						}
						
						doneName = match[0];
						parent = elem.parentNode;
		
						if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
							count = 0;
							
							for ( node = parent.firstChild; node; node = node.nextSibling ) {
								if ( node.nodeType === 1 ) {
									node.nodeIndex = ++count;
								}
							} 

							parent[ expando ] = doneName;
						}
						
						diff = elem.nodeIndex - last;

						if ( first === 0 ) {
							return diff === 0;

						} else {
							return ( diff % first === 0 && diff / first >= 0 );
						}
				}
			},

			ID: function( elem, match ) {
				return elem.nodeType === 1 && elem.getAttribute("id") === match;
			},

			TAG: function( elem, match ) {
				return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
			},
			
			CLASS: function( elem, match ) {
				return (" " + (elem.className || elem.getAttribute("class")) + " ")
					.indexOf( match ) > -1;
			},

			ATTR: function( elem, match ) {
				var name = match[1],
					result = Sizzle.attr ?
						Sizzle.attr( elem, name ) :
						Expr.attrHandle[ name ] ?
						Expr.attrHandle[ name ]( elem ) :
						elem[ name ] != null ?
							elem[ name ] :
							elem.getAttribute( name ),
					value = result + "",
					type = match[2],
					check = match[4];

				return result == null ?
					type === "!=" :
					!type && Sizzle.attr ?
					result != null :
					type === "=" ?
					value === check :
					type === "*=" ?
					value.indexOf(check) >= 0 :
					type === "~=" ?
					(" " + value + " ").indexOf(check) >= 0 :
					!check ?
					value && result !== false :
					type === "!=" ?
					value !== check :
					type === "^=" ?
					value.indexOf(check) === 0 :
					type === "$=" ?
					value.substr(value.length - check.length) === check :
					type === "|=" ?
					value === check || value.substr(0, check.length + 1) === check + "-" :
					false;
			},

			POS: function( elem, match, i, array ) {
				var name = match[2],
					filter = Expr.setFilters[ name ];

				if ( filter ) {
					return filter( elem, i, match, array );
				}
			}
		}
	};

	var origPOS = Expr.match.POS,
		fescape = function(all, num){
			return "\\" + (num - 0 + 1);
		};

	for ( var type in Expr.match ) {
		Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
		Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
	}

	var makeArray = function( array, results ) {
		array = Array.prototype.slice.call( array, 0 );

		if ( results ) {
			results.push.apply( results, array );
			return results;
		}
		
		return array;
	};

	// Perform a simple check to determine if the browser is capable of
	// converting a NodeList to an array using builtin methods.
	// Also verifies that the returned array holds DOM nodes
	// (which is not the case in the Blackberry browser)
	try {
		Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

	// Provide a fallback method if it does not work
	} catch( e ) {
		makeArray = function( array, results ) {
			var i = 0,
				ret = results || [];

			if ( toString.call(array) === "[object Array]" ) {
				Array.prototype.push.apply( ret, array );

			} else {
				if ( typeof array.length === "number" ) {
					for ( var l = array.length; i < l; i++ ) {
						ret.push( array[i] );
					}

				} else {
					for ( ; array[i]; i++ ) {
						ret.push( array[i] );
					}
				}
			}

			return ret;
		};
	}

	var sortOrder, siblingCheck;

	if ( document.documentElement.compareDocumentPosition ) {
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
				return a.compareDocumentPosition ? -1 : 1;
			}

			return a.compareDocumentPosition(b) & 4 ? -1 : 1;
		};

	} else {
		sortOrder = function( a, b ) {
			// The nodes are identical, we can exit early
			if ( a === b ) {
				hasDuplicate = true;
				return 0;

			// Fallback to using sourceIndex (in IE) if it's available on both nodes
			} else if ( a.sourceIndex && b.sourceIndex ) {
				return a.sourceIndex - b.sourceIndex;
			}

			var al, bl,
				ap = [],
				bp = [],
				aup = a.parentNode,
				bup = b.parentNode,
				cur = aup;

			// If the nodes are siblings (or identical) we can do a quick check
			if ( aup === bup ) {
				return siblingCheck( a, b );

			// If no parents were found then the nodes are disconnected
			} else if ( !aup ) {
				return -1;

			} else if ( !bup ) {
				return 1;
			}

			// Otherwise they're somewhere else in the tree so we need
			// to build up a full list of the parentNodes for comparison
			while ( cur ) {
				ap.unshift( cur );
				cur = cur.parentNode;
			}

			cur = bup;

			while ( cur ) {
				bp.unshift( cur );
				cur = cur.parentNode;
			}

			al = ap.length;
			bl = bp.length;

			// Start walking down the tree looking for a discrepancy
			for ( var i = 0; i < al && i < bl; i++ ) {
				if ( ap[i] !== bp[i] ) {
					return siblingCheck( ap[i], bp[i] );
				}
			}

			// We ended someplace up the tree so do a sibling check
			return i === al ?
				siblingCheck( a, bp[i], -1 ) :
				siblingCheck( ap[i], b, 1 );
		};

		siblingCheck = function( a, b, ret ) {
			if ( a === b ) {
				return ret;
			}

			var cur = a.nextSibling;

			while ( cur ) {
				if ( cur === b ) {
					return -1;
				}

				cur = cur.nextSibling;
			}

			return 1;
		};
	}

	// Check to see if the browser returns elements by name when
	// querying by getElementById (and provide a workaround)
	(function(){
		// We're going to inject a fake input element with a specified name
		var form = document.createElement("div"),
			id = "script" + (new Date()).getTime(),
			root = document.documentElement;

		form.innerHTML = "<a name='" + id + "'/>";

		// Inject it into the root element, check its status, and remove it quickly
		root.insertBefore( form, root.firstChild );

		// The workaround has to do additional checks after a getElementById
		// Which slows things down for other browsers (hence the branching)
		if ( document.getElementById( id ) ) {
			Expr.find.ID = function( match, context, isXML ) {
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);

					return m ?
						m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
							[m] :
							undefined :
						[];
				}
			};

			Expr.filter.ID = function( elem, match ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

				return elem.nodeType === 1 && node && node.nodeValue === match;
			};
		}

		root.removeChild( form );

		// release memory in IE
		root = form = null;
	})();

	(function(){
		// Check to see if the browser returns only elements
		// when doing getElementsByTagName("*")

		// Create a fake element
		var div = document.createElement("div");
		div.appendChild( document.createComment("") );

		// Make sure no comments are found
		if ( div.getElementsByTagName("*").length > 0 ) {
			Expr.find.TAG = function( match, context ) {
				var results = context.getElementsByTagName( match[1] );

				// Filter out possible comments
				if ( match[1] === "*" ) {
					var tmp = [];

					for ( var i = 0; results[i]; i++ ) {
						if ( results[i].nodeType === 1 ) {
							tmp.push( results[i] );
						}
					}

					results = tmp;
				}

				return results;
			};
		}

		// Check to see if an attribute returns normalized href attributes
		div.innerHTML = "<a href='#'></a>";

		if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
				div.firstChild.getAttribute("href") !== "#" ) {

			Expr.attrHandle.href = function( elem ) {
				return elem.getAttribute( "href", 2 );
			};
		}

		// release memory in IE
		div = null;
	})();

	if ( document.querySelectorAll ) {
		(function(){
			var oldSizzle = Sizzle,
				div = document.createElement("div"),
				id = "__sizzle__";

			div.innerHTML = "<p class='TEST'></p>";

			// Safari can't handle uppercase or unicode characters when
			// in quirks mode.
			if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
				return;
			}
		
			Sizzle = function( query, context, extra, seed ) {
				context = context || document;

				// Only use querySelectorAll on non-XML documents
				// (ID selectors don't work in non-HTML documents)
				if ( !seed && !Sizzle.isXML(context) ) {
					// See if we find a selector to speed up
					var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
					
					if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
						// Speed-up: Sizzle("TAG")
						if ( match[1] ) {
							return makeArray( context.getElementsByTagName( query ), extra );
						
						// Speed-up: Sizzle(".CLASS")
						} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
							return makeArray( context.getElementsByClassName( match[2] ), extra );
						}
					}
					
					if ( context.nodeType === 9 ) {
						// Speed-up: Sizzle("body")
						// The body element only exists once, optimize finding it
						if ( query === "body" && context.body ) {
							return makeArray( [ context.body ], extra );
							
						// Speed-up: Sizzle("#ID")
						} else if ( match && match[3] ) {
							var elem = context.getElementById( match[3] );

							// Check parentNode to catch when Blackberry 4.6 returns
							// nodes that are no longer in the document #6963
							if ( elem && elem.parentNode ) {
								// Handle the case where IE and Opera return items
								// by name instead of ID
								if ( elem.id === match[3] ) {
									return makeArray( [ elem ], extra );
								}
								
							} else {
								return makeArray( [], extra );
							}
						}
						
						try {
							return makeArray( context.querySelectorAll(query), extra );
						} catch(qsaError) {}

					// qSA works strangely on Element-rooted queries
					// We can work around this by specifying an extra ID on the root
					// and working up from there (Thanks to Andrew Dupont for the technique)
					// IE 8 doesn't work on object elements
					} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
						var oldContext = context,
							old = context.getAttribute( "id" ),
							nid = old || id,
							hasParent = context.parentNode,
							relativeHierarchySelector = /^\s*[+~]/.test( query );

						if ( !old ) {
							context.setAttribute( "id", nid );
						} else {
							nid = nid.replace( /'/g, "\\$&" );
						}
						if ( relativeHierarchySelector && hasParent ) {
							context = context.parentNode;
						}

						try {
							if ( !relativeHierarchySelector || hasParent ) {
								return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
							}

						} catch(pseudoError) {
						} finally {
							if ( !old ) {
								oldContext.removeAttribute( "id" );
							}
						}
					}
				}
			
				return oldSizzle(query, context, extra, seed);
			};

			for ( var prop in oldSizzle ) {
				Sizzle[ prop ] = oldSizzle[ prop ];
			}

			// release memory in IE
			div = null;
		})();
	}

	(function(){
		var html = document.documentElement,
			matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

		if ( matches ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9 fails this)
			var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
				pseudoWorks = false;

			try {
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( document.documentElement, "[test!='']:sizzle" );
		
			} catch( pseudoError ) {
				pseudoWorks = true;
			}

			Sizzle.matchesSelector = function( node, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

				if ( !Sizzle.isXML( node ) ) {
					try { 
						if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
							var ret = matches.call( node, expr );

							// IE 9's matchesSelector returns false on disconnected nodes
							if ( ret || !disconnectedMatch ||
									// As well, disconnected nodes are said to be in a document
									// fragment in IE 9, so check for that
									node.document && node.document.nodeType !== 11 ) {
								return ret;
							}
						}
					} catch(e) {}
				}

				return Sizzle(expr, null, null, [node]).length > 0;
			};
		}
	})();

	(function(){
		var div = document.createElement("div");

		div.innerHTML = "<div class='test e'></div><div class='test'></div>";

		// Opera can't find a second classname (in 9.6)
		// Also, make sure that getElementsByClassName actually exists
		if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
			return;
		}

		// Safari caches class attributes, doesn't catch changes (in 3.2)
		div.lastChild.className = "e";

		if ( div.getElementsByClassName("e").length === 1 ) {
			return;
		}
		
		Expr.order.splice(1, 0, "CLASS");
		Expr.find.CLASS = function( match, context, isXML ) {
			if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
				return context.getElementsByClassName(match[1]);
			}
		};

		// release memory in IE
		div = null;
	})();

	function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];

			if ( elem ) {
				var match = false;

				elem = elem[dir];

				while ( elem ) {
					if ( elem[ expando ] === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}

					if ( elem.nodeType === 1 && !isXML ){
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( elem.nodeName.toLowerCase() === cur ) {
						match = elem;
						break;
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];

			if ( elem ) {
				var match = false;
				
				elem = elem[dir];

				while ( elem ) {
					if ( elem[ expando ] === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}

					if ( elem.nodeType === 1 ) {
						if ( !isXML ) {
							elem[ expando ] = doneName;
							elem.sizset = i;
						}

						if ( typeof cur !== "string" ) {
							if ( elem === cur ) {
								match = true;
								break;
							}

						} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
							match = elem;
							break;
						}
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	if ( document.documentElement.contains ) {
		Sizzle.contains = function( a, b ) {
			return a !== b && (a.contains ? a.contains(b) : true);
		};

	} else if ( document.documentElement.compareDocumentPosition ) {
		Sizzle.contains = function( a, b ) {
			return !!(a.compareDocumentPosition(b) & 16);
		};

	} else {
		Sizzle.contains = function() {
			return false;
		};
	}

	Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833) 
		var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	var posProcess = function( selector, context, seed ) {
		var match,
			tmpSet = [],
			later = "",
			root = context.nodeType ? [context] : context;

		// Position selectors must be done after the filter
		// And so must :not(positional) so we move all PSEUDOs to the end
		while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
			later += match[0];
			selector = selector.replace( Expr.match.PSEUDO, "" );
		}

		selector = Expr.relative[selector] ? selector + "*" : selector;

		for ( var i = 0, l = root.length; i < l; i++ ) {
			Sizzle( selector, root[i], tmpSet, seed );
		}

		return Sizzle.filter( later, tmpSet );
	};

	// EXPOSE
	fmes.Selector = Sizzle;
})();

	fmes.$ = function(selector , context){
			return new fmes.$.fn(selector , context);
	}
	
	fmes.$.cancelBubble = fmes.Event.cancelBubble;
	fmes.$.preventDefault = fmes.Event.preventDefault;
	fmes.$.ready = fmes.Event.ready;
	fmes.$.loadStyleSheet = fmes.Dom.loadStyleSheet;
	fmes.$.removeStyleSheet = fmes.Dom.removeStyleSheet;
	fmes.$.loadScript = fmes.Dom.loadScript;
	fmes.$.getViewportSize = function(){
			return {width : fmes.Dom.getViewportWidth(), height: fmes.Dom.getViewportHeight()};
	}
	fmes.$.getDocumentSize = function(){
			return {width : fmes.Dom.getDocumentWidth(), height: fmes.Dom.getDocumentHeight()};
	}
	
	fmes.$.fn = function(selector, context){
		this.elements = (typeof selector === 'string') ? fmes.Selector(selector) : [selector];
		for(var i = 0 , iLen = this.elements.length ; i < iLen ; i ++){
			this[i] = this.elements[i];
		}
	}
	
	fmes.Class.addMethods(fmes.$.fn  ,{
			get : function(){
					return this.elements;
			},

			each : function(callback, args ){
					return fmes.Util.each( this.elements, callback, args );
			},
			
			_flush : function(){
				for(var i = 0 , iLen = this.elements.length ; i < iLen ; i++){
					this.elements[i] = null;
					this[i] = null;
				}
			},
			
			_set : function(elements){
				this._flush();
				for(var i = 0 , iLen = elements.length; i < iLen ; i ++){
					this[i] = elements[i];
				}
				this.elements = elements;	
			}
	});
	//dom
	fmes.Class.addMethods(fmes.$.fn  ,{
			//查找子孙元素
			find : function(cssExp){
				var elements = [];
				this.each(function(i,elem){
					var elems = fmes.Selector(cssExp , elem);
					for(var i = 0 , iLen = elems.length ; i < iLen ; i++){
						elements.push(elems[i]);
					}
				});
				this._set(elements);
				return this;
			},

			first : function(){
				this._set([this.elements[0]]);
				return this;
			},

			last  : function(){
				this._set([this.elements[this.elements.length-1]]);
				return this;
			},

			children : function(){
				var elements = [];
				this.each(function(i,elem){
					var node = fmes.Dom.getChildNodes(elem);
					if(node && node.length > 0){
						elements.concat(node);
					}
				});
				this._set(elements);
				return this;
			},
			
			attr : function(){
				var _arguments = arguments , len = _arguments.length;
				if(len == 1 ){
					var argu = _arguments[0];
					if(typeof argu === 'string'){
						return this.elements[0].getAttribute(argu);
					}else if(typeof argu === 'object'){
						this.each(function(i,elem){
							for(var i in argu){
								if(/class/i.test(i)){
									elem.className = argu[i];
								}else{
									elem.setAttribute(i , argu[i]);
								}
							}
						});
					}
				}else if(len == 2 && typeof _arguments[0] == 'string' && typeof _arguments[1] == 'string'){
					this.each(function(i,elem){
						elem.setAttribute(_arguments[0] , _arguments[1]);
					});
				}
				return this;				
			},
			
			removeAttr : function(name){
				this.each(function(i,elem){
					elem.removeAttribute(name);
				});
				return this;
			},
			
			empty : function(){
				this.each(function(i,elem){
					elem.innerHTML = '';
				});
			},
			
			remove : function(){
				this.each(function(i,elem){
					fmes.Dom.remove(elem);
				});
				this._flush();
				return this;
			},
			
			detach : function(){
				this.each(function(i,elem){
					fmes.Dom.remove(elem);
				});
				return this;
			},
			
			html : function(){
				var len = arguments.length;
				if(len == 0){
					return this[0].innerHTML;
				}else if(len == 1 && typeof arguments[0] == 'string'){
					this.each(function(i,elem){
						elem.innerHTML = arguments[0];
					});
				}
				return this;
			},
			
			text : function(){
				var len = arguments.length;
				if(len == 0){
					var text = '';
					this.each(function(i,elem){
						text += fmes.String.getText(elem);
					});
					return text;
				}else if(len == 1 && typeof arguments[0] == 'string'){
					this.each(function(i,elem){
						elem.innerHTML = fmes.String.escapeHTML(arguments[0]);
					});
				}
				return this;				
			},
			
			val : function(){
				var len = arguments.length;
				if(len == 0){
					return fmes.Form.Element.value(this[0]);
				}else if(len == 1 && typeof arguments[0] == 'string'){
					var value = arguments[0];
					this.each(function(i,elem){
						fmes.Form.Element.value(elem , value);
					});
				}
				return this;			
			},
			
			allowSelect : function(boolean){
				boolean = ('' + boolean).toLowerCase() === 'false' ? false : true;  
				if(boolean){
					this.each(function(i,elem){
						fmes.Dom.allowSelect(elem);
					});
				}else{
					this.each(function(i,elem){
						fmes.Dom.forbidSelect(elem);
					});	
				}
				return this;
			},
			
			submit : function(){
				this.each(function(i,elem){
					if(elem.tagName.toLowerCase() === 'form'){
						elem.submit();
					}
				});	
				return this;
			},
			
			reset : function(){
				this.each(function(i,elem){
					if(elem.tagName.toLowerCase() === 'form'){
						elem.reset();
					}
				});	
				return this;
			},
			
			serialize : function(flag){
				var result = [];
				this.each(function(i,elem){
					if(elem.tagName.toLowerCase() === 'form'){
						result.push(fmes.Form.serialize(flag));
					}
				});
				if(result.length > 1){
					if(flag){
						return result;
					}else{
						return result.join('&');
					}
				}
			}
		},
		
		(function(){
				var map = {
					'next' : 'nextSibling',
					'prev' : 'previousSibling',
					'parent' : 'getParentNode',
					/*'children' : 'getChildNodes',*///special
					'offsetParent' : 'getOffsetParent'
				};
				var methods = {};
				for(var name in map){
					methods[name] = (function(inVoke){
						return function(){
							var elements = [];
							this.each(function(i,elem){
								var node = fmes.Dom[inVoke](elem);
								if(node){
									elements.push(node);
								}
							});
							this._set(elements);
							return this;
						};
					})(map[name]);
				}
				return methods;	
		})(),
		//insert inner
		(function(){
				var map = {
					'append' : 'append',
					'prepend' : 'prepend',
				};
				var methods = {}; 
				for(var name in map){
					methods[name] = (function(inVoke){
						return function(content){
							fmes.Dom[inVoke](content,this.elements[0]);
							return this;
						};
					})(map[name]);
				}
				return methods;	
		})(),
		//insert outer
		(function(){
				var map = {
					'before' : 'insertBefore',
					'after' : 'insertAfter',
					'replaceWith' : 'replace'
				};
				var methods = {};
				for(var name in map){
					methods[name] = (function(inVoke){
						return function(content){
							this.each(function(i,elem){
								fmes.Dom[inVoke](content, elem);
							});
							return this;
						};
					})(map[name]);
				}
				return methods;	
		})()
	);//end of addMethods invoke
	//css 
	fmes.Class.addMethods(fmes.$.fn  , 	{   
				hasClass : function(className){
					return fmes.Css.hasClass(this[0] , className)
				},
					
				css : function(){
					var len = arguments.length,
						argu = arguments;
					if(len == 0){
						return this;
					}else if(len == 1 && typeof argu[0] === 'string'){
						return fmes.Css.getStyle(this.elements[0] , argu[0]); 
					}else{
						this.each(function(i,elem ){
							if(len == 1){
								fmes.Css.setStyle(elem ,argu[0]);
							}else if(len == 2){
								fmes.Css.setStyle(elem ,argu[0],argu[1]);					
							}else{
								return false;
							}
						});
						return this;
					}
				}
			},
			(function(){
				var map = {
					'addClass' : 'addClass',
					'removeClass' : 'removeClass'
				};
				var methods = {};
				for(var name in map){
					methods[name] = (function(inVoke){
						return function(value){
							this.each(function(i,elem){
								fmes.Css[inVoke](elem ,value);
							});
							return this;
						};
					})(map[name]);
				}
				return methods;
			})(),
			(function(){
				var fun = ['width','height','position' ,'offset' , 'opacity' ,'scrollTop' , 'scrollLeft'];
				var methods = {};
				for(var i = 0 , iLen = fun.length ; i < iLen ; i++){
					methods[fun[i]] = (function(method){
						method = fmes.String.capitalize(method);
						return function(value){
									var len = arguments.length;
									if(len === 0){
										return fmes.Css['get'+method](this.elements[0]);
									}else{
										this.each(function(i,elem){
											fmes.Css['set'+method](elem , value);
										});
										return this;
									}
						};
					})(fun[i]);
				}
				return methods;
			})(),
			(function(){
				var map = {
					'innerWidth' : 'getInnerWidth',
					'innerHeight': 'getInnerHeight' ,
					'outerWidth' : 'getOuterWidth' , 
					'outerHeight' : 'getOuterHeight'
				};
				var methods = {};
				for(var name in map){
					methods[name] = (function(inVoke){
						return function(){
							return fmes.Css[inVoke](this.elements[0]);
						};
					})(map[name]);
				}
				return methods;
			})()
	);
	//event
	fmes.Class.addMethods(fmes.$.fn  ,{
			dispatchEvent : function(type){
				this.each(function(i,item){
					fmes.Event.dispatchEvent(item , type);	
				});
			}
		},
		(function(){
				var fun = ['addListener','removeListener'],
					methods = {};
				
				for(var i = 0 , iLen = fun.length ; i < iLen ; i++){
					methods[fun[i]] = (function(method){
						return function(type , callback){
									this.each(function(i,item){
										fmes.Event[method](item , type , callback);	
									});
									return this;
								};
					})(fun[i]);
				}
				return methods;
		})(),
		{
			delegate : function(selector , type , handle){
				this.each(function(i,item){
					fmes.Event.delegate(item , selector, type , handle);	
				});
				return this;
			},
			
			undelegate : function(type,handle){
				this.each(function(i,item){
					fmes.Event.undelegate(item , type , handle);	
				});
				return this;
			}
		}
	);
	window.fmes = fmes;
})(window)