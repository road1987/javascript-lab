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
	 * 		// regionType can be ( region | city | district | street )
	 *   	reqUrl  : /yxtws/v2/hxyxt/yaomeng/chainstores/region/{{isocode}}?regionType={{regionType}}
	 * }
	 * 
	 */
	function AddressSelector(options){
		this._trigger = options.trigger ;
		this._onFinish = options.onFinish || function(){
		};
		this._reqUrl   = options.reqUrl || null;
		this._initData = options.initData || null;
		this.data = {
			country : { isocode : "CN" , name : "中国" , regionType : 'country'}, 
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
			var X = triggerElm.getBoundingClientRect().left+$(document).scrollLeft();
 			var Y = triggerElm.getBoundingClientRect().top+$(document).scrollTop() + $(triggerElm).height();
			$(this._panelElement).css({"top" : Y, "left" : X }).show();
		},

		closePanel : function(){
			$(this._panelElement).hide();
		},

		loadAddressListInfo : function( itemInfo ){

			var me = this;
			var regionType = itemInfo.regionType;
			//for fix data interface word wrong
			//var regionTypeBugFix = (regionType == 'district') ? 'dictrict' : regionType;
			var isocode = itemInfo.isocode;
			var reqUrl = this._reqUrl.replace(/{{\s*isocode\s*}}/, isocode).replace( /{{\s*regionType\s*}}/, regionType);

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
			var data = this._initData || this.data;
			for(var i in data){
				if( data[i] ){
					this.setAddressData( i , data[i]);
				}
			}/*
			this.loadAddressListInfo({
				name : '',
				isocode : 'CN',
				regionType : 'region'
			});*/
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
				innerHTML.push('		<li class="J_tab_item_city tab-item" data-index="city" style="display:none;">请选择</li>');
				innerHTML.push('		<li class="J_tab_item_district tab-item" data-index="district" style="display:none;">请选择</li>');
				innerHTML.push('		<li class="J_tab_item_street tab-item" data-index="street" style="display:none;">请选择</li>');
				innerHTML.push('	</ul>');
				innerHTML.push('</div>');
				innerHTML.push('<div class="hybris-address-selector-body">');
				innerHTML.push('	<div class="tab-area tab-area-active J_tab_area_region">');
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