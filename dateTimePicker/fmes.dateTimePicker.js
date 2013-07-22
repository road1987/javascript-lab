if(!window.FMES){
	window.FMES = function(target){
		if(!target){return false;}
		target = $(target).get()[0];
		FMES.target = target;
		return FMES;
	}
}

(function(namespace){
	
	var instance = null;
	var instanceList = [];
	namespace = namespace || window;
	namespace.dateTimePicker = function(options){
		//var dateTimePicker = instance || new DateTimePicker(options);
		var dateTimePicker = new DateTimePicker(options);
		return dateTimePicker;
	}

	function DateTimePicker(options){
		var _this = this;
		this._options = {
				receiver : $(options.receiver || DateTimePicker.defaults.receiver).get()[0] ,
				trigger :  $(options.trigger || DateTimePicker.defaults.trigger).get()[0] ,
				pattern :  options.pattern || DateTimePicker.defaults.pattern ,
				isShowDate :  (typeof options.isShowDate) == 'boolean' ?  options.isShowDate : DateTimePicker.defaults.isShowDate ,
				isShowTime :  (typeof options.isShowTime) == 'boolean' ?  options.isShowTime : DateTimePicker.defaults.isShowTime 			
		};
		this._instanceRegister(this._options);
		if(instance){
			return instance;
		}
		
		this.todayInfo = this.getTodayDateInfo();
		this.date = this.getTodayDateInfo();
		this.time = this.getNowTimeInfo();
		
		this._UI = this._createDateTimePickerUI();
		this._datePanel = this._UI['datePanel'];
		this._timePanel = this._UI['timePanel'];
		this._toolbarPanel = this._UI['toolbarPanel'];

		//init
		this.setDate(this.date.year, this.date.month , this.date.day);
		this.setTime(this.time.hour, this.time.minute , this.time.second);
		this.startTime = setInterval(function(){
			_this.time = _this.getNowTimeInfo();
			_this.setTime(_this.time.hour, _this.time.minute , _this.time.second);
		},500);
		this._addEventBind();
		if(!this._options['isShowDate']){
			this.closeDatePanel();
		}
		if(!this._options['isShowTime']){
			this.closeTimePanel();
		}
		this.close();
		instance = this;
	}

	DateTimePicker.prototype = {
		setDate : function(year, month , day){
			 this.date['year'] = year;
			 this.date['month'] = month;
			 this.date['day'] = day;

			 $(this._datePanel['year']).html(year);
			 $(this._datePanel['month']).html(month);
			 var daysNumber = this._getdaysFromYearMonth(year,month);
			 var daysPanelContent = '';

			 for(var i = 0 , week = null; i < daysNumber ; i++){
				week = this._getDayFromDate(year, month , i+1);
				if(i == 0 || week == 0){
					daysPanelContent +='<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
				}
			 }

			 $(this._datePanel.day).html(daysPanelContent);

			 var items = $(this._datePanel.day).find('td');
			 var startIndex = this._getDayFromDate(year , month , 1);
			 for(var j = 1 ; j <= daysNumber ; j++,startIndex++){
				if(year == this.todayInfo.year && month == this.todayInfo.month && j == this.todayInfo.day){
					$(items[startIndex]).html('<a class="today">'+ j +'</a>');
				}else if(year == this.date.year && month == this.date.month && j == this.date.day){
					$(items[startIndex]).html('<a class="selected">'+ j +'</a>');
				}else{
					$(items[startIndex]).html('<a>'+ j +'</a>');
				}
			 }
		},
		
		setTime : function(hour,minute,second){
			 $(this._timePanel['hour']).html(hour);
			 $(this._timePanel['minute']).html(minute);
			 $(this._timePanel['second']).html(second);
			 this.time['hour'] = hour;
			 this.time['minute'] = minute;
			 this.time['second'] = second;
		},

		close : function(){
			$(this._UI).css('display' , 'none');
		},
		
		open : function(relationReceiver){
			var pos = getPosition(relationReceiver);
				pos.y = relationReceiver.offsetHeight + pos.y +'px';
				pos.x = pos.x +  'px';
			$(this._UI).css({display:'inline' , top: pos.y , left: pos.x, position:'absolute'});

			function getPosition(obj){
				var pos = {x : 0, y: 0};
				if(obj.offsetParent){
					do{
						pos.x += obj.offsetLeft;
						pos.y += obj.offsetTop;
					}while(obj = obj.offsetParent)
				}
				return pos;
			}
			
			var _this = this;
			$(document).mousedown(function closePanel(){
				_this._clearOperate();
				_this.close();	
				$(this).unbind("mousedown" , closePanel);
			});
		},

		getTodayDateInfo : function(){
			var today = new Date();
			return {
				year : today.getFullYear(),
				month : today.getMonth() + 1,
				day : today.getDate()
			};		
		},

		getNowTimeInfo : function(){
			var nowTime = new Date();
			return {
				hour : nowTime.getHours(),
				minute : nowTime.getMinutes(),
				second : nowTime.getSeconds()
			};
		},
		
		_getdaysFromYearMonth : function(year,month){
			 var date= new Date(year,month,0);
			 return date.getDate();			
		},

		//从日期获取星期值
		_getDayFromDate : function(year,month,day){
			return new Date(year,month-1,day).getDay();
		},

		showDatePanel : function(){
			$(this._datePanel).css('display' , 'inline');
			return this._datePanel;
		},
		
		closeDatePanel : function(){
			$(this._datePanel).css('display' , 'none');
			return this._datePanel;
		},

		showTimePanel : function(){
			$(this._timePanel).css('display' , 'block');
			return this._timePanel;		
		},
		
		closeTimePanel : function(){
			$(this._timePanel).css('display' , 'none');
			return this._timePanel;		
		},

		_addEventBind : function(){
			var _this = this;
			$(this._UI.datePanel['day']).delegate("a", "click", function(){
				$(_this._UI.datePanel['day']).find('.selected').each(function(){
					this.className = '';
				});
				if(this.className !== 'today'){
					this.className = 'selected';
				}
				_this.date['day'] = $(this).html();
			});

			$(this._UI.datePanel['preMonth']).click(function(){
				_this.date['month']--;
				if(_this.date['month'] == 0){
					_this.date['month'] = 12;
					_this.date['year']--;
				}
				_this.setDate(_this.date['year'],_this.date['month'],_this.date['day']);
			});
			
			$(this._UI.datePanel['nextMonth']).click(function(){
				_this.date['month']++;
				if(_this.date['month'] == 13){
					_this.date['month'] = 1;
					_this.date['year']++;
				}
				_this.setDate(_this.date['year'],_this.date['month'],_this.date['day']);				
			});

			$(this._UI.datePanel['year']).click(function(){
				var that = this;
				if(!this.select){
					var select = '<select>';
					for(var i = _this.date.year - 9 , iLen = (_this.date.year - 0 + 10); i < iLen ; i++){
						if(i == _this.date.year){
							select += ('<option selected="true">' + i + '</option>'); 
						}else{
							select += ('<option>' + i + '</option>'); 
						}
					}
					select +=  '</select>';
					this.innerHTML = select;
					this.select = this.getElementsByTagName('select')[0];
					this.select.focus();
					this.select.onblur = afterOperate;
					this.select.onchange = afterOperate;
				}

				function afterOperate(){
						_this.date.year = this.options[this.selectedIndex].text;
						_this.setDate(_this.date.year,_this.date.month,_this.date.day)
						that.select = false;					
				} 
			});

			$(this._UI.datePanel['month']).click(function(){
				var that = this;
				if(!this.select){
					var select = '<select>';
					for(var i = 1 , iLen = 13; i < iLen ; i++){
						if(i == _this.date.month){
							select += ('<option selected="true">' + i + '</option>'); 
						}else{
							select += ('<option>' + i + '</option>'); 
						}
					}
					select +=  '</select>';
					this.innerHTML = select;
					this.select = this.getElementsByTagName('select')[0];
					this.select.focus();
					this.select.onblur = afterOperate;
					this.select.onchange = afterOperate;
				}

				function afterOperate(){
						_this.date.month = this.options[this.selectedIndex].text;
						_this.setDate(_this.date.year,_this.date.month,_this.date.day)
						that.select = null;					
				}
			});

			$(this._UI.timePanel['hour']).click(function(){
				clearInterval(_this.startTime);
				var that = this;
				if(!this.select){
					var select = '<select>';
					for(var i = 0 , iLen = 24; i < iLen ; i++){
						if(i == _this.time.hour){
							select += ('<option selected="true">' + i + '</option>'); 
						}else{
							select += ('<option>' + i + '</option>'); 
						}
					}
					select +=  '</select>';
					this.innerHTML = select;
					this.select = this.getElementsByTagName('select')[0];
					this.select.focus();
					this.select.onblur = afterOperate;
					this.select.onchange = afterOperate;
				}

				function afterOperate(){
						_this.time.hour = this.options[this.selectedIndex].text;
						_this.setTime(_this.time.hour,_this.time.minute,_this.time.second);
						that.select = null;					
				}
			});

			$(this._UI.timePanel['minute']).click(function(){
				clearInterval(_this.startTime);
				var that = this;
				if(!this.select){
					var select = '<select>';
					for(var i = 0 , iLen = 60; i < iLen ; i+=5){
						if(i == _this.time.minute){
							select += ('<option selected="true">' + i + '</option>'); 
						}else{
							select += ('<option>' + i + '</option>'); 
						}
					}
					select +=  '</select>';
					this.innerHTML = select;
					this.select = this.getElementsByTagName('select')[0];
					this.select.focus();
					this.select.onblur = afterOperate;

					this.select.onchange = afterOperate;
				}

				function afterOperate(){
						_this.time.minute = this.options[this.selectedIndex].text;
						_this.setTime(_this.time.hour,_this.time.minute,_this.time.second);
						that.select = null;					
				}
			});

			$(this._UI.timePanel['second']).click(function(){
				clearInterval(_this.startTime);
				var that = this;
				if(!this.select){
					var select = '<select>';
					for(var i = 0 , iLen = 60; i < iLen ; i+=1){
						if(i == _this.time.second){
							select += ('<option selected="true">' + i + '</option>'); 
						}else{
							select += ('<option>' + i + '</option>'); 
						}
					}
					select +=  '</select>';
					this.innerHTML = select;
					this.select = this.getElementsByTagName('select')[0];
					this.select.focus();
					this.select.onblur = afterOperate;
					this.select.onchange = afterOperate;
				}

				function afterOperate(){
						_this.time.second = this.options[this.selectedIndex].text;
						_this.setTime(_this.time.hour,_this.time.minute,_this.time.second);
						that.select = null;					
				}
			});
			
			$(this._UI.toolbarPanel['now']).click(function(){
				_this._clearOperate();
			});

			$(this._UI.toolbarPanel['submit']).click(function(){
				$(_this._options['receiver']).val(_this.getValue());
				_this._clearOperate();
				_this.close();			
			});

			$(this._UI.toolbarPanel['close']).click(function(){
				_this._clearOperate();
				_this.close();
			});
			
			$(this._UI.datePanel['day']).delegate("a" , "dblclick" , function(){
				$(_this._UI.toolbarPanel['submit']).click();		
			});
			
			$(this._UI).mousedown(function(e){
				e.stopPropagation();
			});
		},

		_createDateTimePickerUI : function(){
			var UI = document.createElement('div');
				$(UI).addClass('fmes-dateTimePicker');
			
				$(UI).html(
				'<div class = "datePanel">' + 
					'<div class="header">' + 
						'<a class="preMonth">«</a>' + 
						'<div class="title"><span class="yearPanel">2011</span>年<span class="monthPanel">8</span>月'+
						'</div>'+
						'<a class="nextMonth">»</a>' + 
					'</div>' +
					'<div class="body">' + 
						'<table>' +
							'<thead>' + 
								'<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>' +
							'</thead>' +
							'<tbody class="dayPanel">' +
							'</tbody>' + 
						'</table>' +
					'</div>' +
				'</div><!--end of dataPanel-->' +
				'<div class="timePanel" >时间：<span>12</span> ：<span>25</span> ：<span>60</span> </div>'+
				'<div class="toolbarPanel"><input type="button" value="当前"/><input type="button" value="确定"/><input type="button" value="关闭"/></div>');

				UI.datePanel = $(UI).find('.datePanel').get()[0];
				UI.datePanel['preMonth'] = $(UI).find('.preMonth').get()[0];
				UI.datePanel['nextMonth'] = $(UI).find('.nextMonth').get()[0];
				UI.datePanel['year'] =  $(UI).find('.yearPanel').get()[0];
				UI.datePanel['month'] =  $(UI).find('.monthPanel').get()[0];
				UI.datePanel['day'] =  $(UI).find('.dayPanel').get()[0];
				UI.timePanel = $(UI).find('.timePanel').get()[0];
				UI.timePanel['hour'] = $(UI.timePanel).find('span')[0];
				UI.timePanel['minute'] = $(UI.timePanel).find('span')[1];
				UI.timePanel['second'] = $(UI.timePanel).find('span')[2];
				UI.toolbarPanel = $(UI).find('.toolbarPanel')[0];
				UI.toolbarPanel['now'] = $(UI.toolbarPanel).find('input')[0];
				UI.toolbarPanel['submit'] = $(UI.toolbarPanel).find('input')[1];
				UI.toolbarPanel['close'] = $(UI.toolbarPanel).find('input')[2];
				document.body.appendChild(UI);
				UI.onselectstart =function(){return false;};
				UI.style.MozUserSelect = 'none';
			return UI;
		},
		
		getValue : function(pattern){
			var pattern = pattern || this._options['pattern'];	
			pattern = pattern.replace(/h/i , this.time.hour);
			pattern = pattern.replace(/(mm)/i , this.time.minute);
			pattern = pattern.replace(/(ss)/i , this.time.second);
			pattern = pattern.replace(/y/i , this.date.year);
			pattern = pattern.replace(/m/i , this.date.month);
			pattern = pattern.replace(/d/i , this.date.day);
			return pattern;
		},
		
		_clearOperate : function(){
			var _this = this;
			this.setDate(this.todayInfo.year, this.todayInfo.month , this.todayInfo.day);
			clearInterval(this.startTime);
			this.startTime = setInterval(function(){
				_this.time = _this.getNowTimeInfo();
				_this.setTime(_this.time.hour, _this.time.minute , _this.time.second);
			},500);
		},
		
		_instanceRegister : function(options){
			$(options.trigger).click(function(){
				instance.open(options.receiver);
				for(var i = 0 ; i < instanceList.length ; i++){
					if(this == instanceList[i].trigger){
						instance._options = instanceList[i];
						break;
					}
				}
				if(instance._options['isShowDate']){
					instance.showDatePanel();
				}else{
					instance.closeDatePanel();
				}
				if(instance._options['isShowTime']){
					instance.showTimePanel();
				}else{
					instance.closeTimePanel();
				}
			});
			instanceList.push(options);
		}
	}
	
	DateTimePicker.defaults = {
		trigger : null,
		receiver : null, 
		pattern : 'y-m-d  h:mm:ss',
		isShowDate : true, 
		isShowTime : true
	}
	
})(FMES);
