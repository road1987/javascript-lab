
	function EventListenerList(){
		this.event = {};
	}

	EventListenerList.prototype = {
		add : function(type , listener){
			if(!this.event[type]){
				this.event[type] = [];
			}
			this.event[type].push(listener);
			return true;
		},

		remove : function(type,listener){
			var list = this.event[type];
			for(i = 0 , len = list.length ; i < len ; i ++){
				if(listener === list[i]){
					//remove listener;
					return list.splice(i , 1);
				}
			}
			return [];
		},

		getListenerCount : function(type){
			if(this.event[type]){
				return this.event[type].length;
			}else{
				return 0;
			}
		},
		
		getListeners : function(type){
			if(this.event[type]){
				return this.event[type];
			}else{
				return [];
			}
		},
		
		clear : function() {
			this.list.length = 0;
			return this;
		}
	}


/////////////////////////////////////event
	function ChangeEvent(source){
		this.source = source;
	}

	ChangeEvent.prototype = {
		getSource : function(){
			return this.source;
		}
	}

	function StateChangeEvent(source){
		this.source = source;
	}
	
	StateChangeEvent.prototype = {
		getSource : function(){
			return this.source;
		},
		
		getState : function(){
			return this.source.getState();
		}
	}

	function MouseEvent(source){
		this.source = source;
	}

	MouseEvent.CLICK = "click" ;
	MouseEvent.DOUBLE_CLICK = "doubleClick";
	MouseEvent.MOUSE_DOWN = "mouseDown";
	MouseEvent.MOUSE_MOVE = "mouseMove";
	MouseEvent.MOUSE_OUT = "mouseOut";
	MouseEvent.MOUSE_OVER = "mouseOver";
	MouseEvent.MOUSE_UP = "mouseUp";
	MouseEvent.MOUSE_WHEEL = "mouseWheel";

/////////////////////////////////////UIManager

	function UIManager(){
		this.laf = 'default';
	
	}

	var UIManager = function(){
		var lookAndFeelList = ['default' , 'gray']; 
		
		
		return {
			getUI : function(component){
				
			},
			
			addLaf : function(){
			
			},

			getLaf : function(){
				
			},

			setLaf : function(laf){
				
			},

			setLookAndFeel : function(laf){
				
			}
		}
	}// end of UIManager


/////////////////////////////////////view 
	function ButtonUI(component){
		this.element = ButtonUI.createUI(component);
		this.element.text.innerHTML = component.getText();
		this._registerEvent(component);
	}

	ButtonUI.prototype = {
		//private
		_onMouseOver : function(){
			this.element.className = 'fmes-btn fmes-btn-hover';
		},
		
		_onMouseOut : function(){
			this.element.className = 'fmes-btn';
		},

		_onMouseDown : function(){
			this.element.className = 'fmes-btn  fmes-btn-pressed fmes-btn-hover';
		},

		_onMouseUp : function(){
			this.element.className = 'fmes-btn';
		},

		_registerEvent : function(component){
			var _this = this;
			this.element.onmouseover = function(){
				component.fireEvent(MouseEvent.MOUSE_OVER);
				_this._onMouseOver.call(_this);
				return false;
			}

			this.element.onmouseout = function(){
				_this._onMouseOut.call(_this);
				component.fireEvent(MouseEvent.MOUSE_OUT);
			}

			this.element.onclick = function(){
				component.fireEvent(MouseEvent.CLICK);
			}

			this.element.onmousedown = function(){
				_this._onMouseDown.call(_this);
			}
		}
	}

	ButtonUI.createUI = function(component){
		var element = document.createElement('div') ;
			element.className = 'fmes-btn'; 
			element.innerHTML = ['<span class="fmes-btn-arrow fmes-btn-arrow-bottom">',
									'<button autocomplete="off" role="button" hidefocus="true" type="button">' ,
										'<span class="fmes-btn-text">&nbsp;</span>' ,
										'<span class="fmes-btn-icon">&nbsp;</span>' ,
									'</button>',
								'</span>'].join('');
			element.button = element.getElementsByTagName('button')[0];
			element.button.onfocus = function(){
				element.className = 'fmes-btn fmes-btn-hover';
				//alert(1);
				//this.blur();
			}
			element.button.onblur = function(){
				element.className = 'fmes-btn';
				//alert(1);
				//this.blur();
			}
			element.text = element.getElementsByTagName('span')[1];
			element.icon = element.getElementsByTagName('span')[2];
		return element;
	}

	ButtonUI.defaults = {
		WIDTH : '80px',
		HEIGHT : '24px'
	}


//////////////////////////////////////////model
	function ButtonModel(){
		this.state = 'defalut';
		this.listenerList =  new EventListenerList();
	}

	ButtonModel.prototype = {
		setState : function(state){
			this.state = state;
		},

		addListener : function(type , handle){
			this.listenerList.add(type, handle);
		},

		removeListener : function(type , handle){
			this.listenerList.remove(type, handle);
		},

		fireEvent : function(type , eventObj){
			var listeners = this.listenerList.getListeners(type);
			for(var i = 0 , iLen = listeners.length; i < iLen ; i ++){
				listeners[i](eventObj);
			}
			return true;
		}
	}

//////////////////////////////////////////control
	function Button(label){
		this.label = label ;
		this.model = new ButtonModel();
		this.ui = new ButtonUI(this);
	}

	Button.prototype = {
		getText : function(){
			return this.label;
		},

		addListener : function(type, handle){
			this.model.addListener(type, handle);
		},

		removeListener : function(type, handle){
			this.model.removeListener(type, handle);
		},

		fireEvent : function(type){
			var eventObj = null;
			switch(type){
				case 'propertiesChange':
					eventObj = new ChangeEvent(this);
					break;
				case 'mouseOver':
					eventObj = new StateChangeEvent(this);
					break;
				case 'mouseOut':
					eventObj = new StateChangeEvent(this);
					break;
				default : 
					break;
			}
			this.model.fireEvent(type , eventObj);
		},

		setText : function(text){
			this.label = text;
			this.ui.repaint(this);
			this.fireEvent('propertiesChange');
		},

		setDisabled : function(bool){
			this.ui.element.button.disabled = bool;
		}
	}