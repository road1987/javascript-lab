/**
 * @description based jquery ， hybris address selector
 * @author hongchun.li
 * @date 2016-04-13
 * @return {[type]} [description]
 */
(function($){
	/**
	 * @param { Object } options {config options}
	 * @param example 
	 * options = {
	 * 		trigger : "#trigger"
	 *   	reqUrl  : { 
	 *   		region : https://200.20.30.55:9002/yxtws/v2/hxyxt/yaomeng/chainstores/region/CN?regionType=region
	 *   	}
	 * }
	 * 
	 */
	function AddressSelector(options){
		this._trigger = options.trigger ;
		this._onFinish = options.onFinish || function(){
		};
		this.reqUrl  = {
			"region"   : "https://200.20.30.55:9002/yxtws/v2/hxyxt/yaomeng/chainstores/region/{{ isocode }}?regionType=region",
			"city"	   : "https://200.20.30.55:9002/yxtws/v2/hxyxt/yaomeng/chainstores/region/{{ isocode }}?regionType=city",
			"district" : "https://200.20.30.55:9002/yxtws/v2/hxyxt/yaomeng/chainstores/region/{{ isocode }}?regionType=dictrict",
			"street"   : "https://200.20.30.55:9002/yxtws/v2/hxyxt/yaomeng/chainstores/region/{{ isocode }}?regionType=street"	
		};
		this.data = {
			country : { isocode : "CN" , name : "中国"}, 
			region 	: null,
			city : null,
			district: null,
			street 	: null
		};
		this._panelElement = this._uiBuild();
		this._init();
	}

	AddressSelector.prototype = {
		getAddressData : function(regionType){
			if(regionType){
				return this.data[regionType];
			}else{
				return this.data;
			}
		},

		onFinish : function( callback ){
			if(typeof callback == "function"){
				this._onFinish = callback;
			}else{
				throw new Error('The parameter must be a function');
			}
		},

		setAddressData : function( regionType , value ){
			
			var me = this;
			if( arguments.length === 1){
				this.data = arguments[0];
			}else{
				this.data[regionType] = value;
				var regionTypeArray = ['country','region','city','district','street'];
				var regionTypeIndex = $.inArray(regionType , regionTypeArray);

				//show or hide tab-item
				$.each( regionTypeArray , function(i, item){
					if( i <=  regionTypeIndex + 1 ){
						$(me._panelElement).find('.J_tab_item_' + item).show();
					}else{
						$(me._panelElement).find('.J_tab_item_' + item).hide();
					}
				});

				$.each( regionTypeArray , function(i, item){
					if( i >  regionTypeIndex ){
						me.data[item] = '';
					}
				});

				if( regionTypeIndex < regionTypeArray.length - 1 ){
					this._selectTabItem(regionTypeArray[++regionTypeIndex]);
				}
				/*
				if(regionType == "country"){
					this.data['region'] = '';
					this.data['city'] = '';
					this.data['district'] = '';
					this.data['street'] =  '';
				}else if(regionType =="region"){
					this.data['city'] = '';
					this.data['district'] = '';
					this.data['street'] =  '';
					this._selectTabItem('city');	
				}else if(regionType == "city"){
					this.data['district'] = '';
					this.data['street'] =  '';
					this._selectTabItem('district');
				}else if(regionType == "district"){
					this.data['street'] =  '';
					this._selectTabItem('street');
				}*/
			}
			
			//show or hide J_tab_item

			//tab-item 名称更改
			$.each(['region','city','district','street'] , function(i, item){
				$(me._panelElement).find('.J_tab_item_' + item).html(me.data[item] && me.data[item].name || '请选择');
			});

			if(arguments.length === 2 && regionType == "street"){
				this._onFinish(me.data);
				this.closePanel();
			}
			return this.data;
		},

		showPanel : function(){
			var triggerElm = $( this._trigger ).get(0); 
			var X = triggerElm.getBoundingClientRect().left+document.documentElement.scrollLeft;
 			var Y = triggerElm.getBoundingClientRect().top+document.documentElement.scrollTop + $(triggerElm).height();
			$(this._panelElement).css({"top" : Y, "left" : X }).show();
		},

		closePanel : function(){
			$(this._panelElement).hide();
		},

		loadAddressListInfo : function( itemInfo ){

			var me = this;
			var regionType = itemInfo.regionType;
			var isocode = itemInfo.isocode;
			var reqUrl = this.reqUrl[regionType].replace(/{{\s*isocode\s*}}/, isocode);

			$.ajax({
	            url : reqUrl,
	            method : "get",
	            contentType: 'application/json; charset=utf-8',
	            dataType: 'json',
	            success : function(resp){
	              if(resp){
	                  me._generateAddressList(regionType, resp);
	              }else{
	                  alert("地址信息请求失败");
	              }
	            },
	            error : function(resp){
	              alert(resp);
	            }
          	});
		},

		_selectTabItem : function( index ){
			$(this._panelElement).find(".tab-item-active").removeClass("tab-item-active");
			$(this._panelElement).find(".J_tab_item_" + index).addClass("tab-item-active");
			$(this._panelElement).find(".tab-area-active").removeClass("tab-area-active");
			$(this._panelElement).find(".J_tab_area_" + index).addClass("tab-area-active");

			var isocode = "";
			if(index == 'region'){
				isocode = this.data['country'].isocode;
			}else if(index == 'city'){
				isocode = this.data['region'].isocode ; 
			}else if( index == "district"){
				isocode = this.data['city'].isocode;
			}else if( index == "street"){
				isocode = this.data['district'].isocode;
			}

			this.loadAddressListInfo({
				isocode : isocode,
				regionType : index
			});
			
		},

		_init : function(){
			this._eventBind();
			//UI BUILD , EVENT BIND
			//初始化省份信息
			this.loadAddressListInfo({
				name : '',
				isocode : 'CN',
				regionType : 'region'
			});
		},

		_eventBind : function(){
			var me = this;
			$(this._trigger).click(function(){
				me.showPanel();
			});

			$(this._panelElement).find(".close").click(function(){
				me.closePanel();
			});

			$(this._panelElement).find(".tab-item").click(function(){
				var index = $(this).attr('data-index');
				me._selectTabItem( index );
			});

			$(this._panelElement).find(".tab-area").delegate('a','click' ,function(){
				me.setAddressData($(this).attr('data-region-type') , {
					name       : $(this).attr('data-name'),
					isocode    : $(this).attr('data-isocode'),
					regionType : $(this).attr('data-region-type')
				});
			});
		},

		_generateAddressList : function(regionType, addressInfo){
			var result = ['<ul class="area-list">'];
			for(var i = 0 , iLen = addressInfo.length ; i < iLen ; i++){
				var item = addressInfo[i];
				result.push('<li class="area-item">');
				result.push('<a href="#none" data-isocode="' + item.isocode+ '" data-name="' + item.name + '" data-region-type="' + regionType + '">' + item.name + '</a>');
				result.push('</li>');
			}
			result.push('</ul>');
			$(this._panelElement).find(".J_tab_area_" + regionType).html(result.join(''));
		},

		_uiBuild : function(){
			var panel = $("<div />").addClass("hybris-address-selector");
			var innerHTML = [];
				innerHTML.push('<div class="hybris-address-selector-header">');
				innerHTML.push('	<div class="close">×</div>');
				innerHTML.push('	<ul class="tab">');
				innerHTML.push('		<li class="J_tab_item_region tab-item tab-item-active" data-index="region">请选择</li>');
				innerHTML.push('		<li class="J_tab_item_city tab-item" data-index="city">请选择</li>');
				innerHTML.push('		<li class="J_tab_item_district tab-item" data-index="district">请选择</li>');
				innerHTML.push('		<li class="J_tab_item_street tab-item" data-index="street">请选择</li>');
				innerHTML.push('	</ul>');
				innerHTML.push('</div>');
				innerHTML.push('<div class="hybris-address-selector-body">');
				innerHTML.push('	<div class="tab-area tab-area-active J_tab_area_region">');				
				// innerHTML.push('		<ul class="area-list">');
				// innerHTML.push('			<li class="area-item"><a href="#" data-isocode="1" data-name="北京" data-region-type="region">北京</a></li>');
				// innerHTML.push('			<li class="area-item"><a href="#" data-isocode="2" data-name="云南省" data-region-type="region">云南省</a></li>');
				// innerHTML.push('			<li class="area-item"><a href="#" data-isocode="3" data-name="上海"  data-region-type="region">上海</a></li>');
				// innerHTML.push('			<li class="area-item"><a href="#" data-isocode="4" data-name="南京"  data-region-type="region">南京</a></li>');
				// innerHTML.push('		</ul>');
				innerHTML.push('	</div>');
				innerHTML.push('	<div class="tab-area J_tab_area_city">');				
				innerHTML.push('	</div>');
				innerHTML.push('	<div class="tab-area J_tab_area_district">');					
				innerHTML.push('	</div>');
				innerHTML.push('	<div class="tab-area J_tab_area_street">');				
				innerHTML.push('	</div>');							
				innerHTML.push('<div>');
			$(panel).html(innerHTML.join(''));
			$(document.body).append(panel);
			return panel;
		}
	}

	if(!window.AddressSelector){
		window.AddressSelector = AddressSelector;
	}else{
		throw new Error("");
	}
})(jQuery);