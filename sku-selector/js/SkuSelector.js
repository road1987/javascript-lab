if(!window.Util){ window.Util = {} };
Util.Sort = (function(){

	function arrMinNum(arr){
	    var minNum = Infinity, index = -1,minVul = "";
	    for (var i = 0; i < arr.length; i++) {
	        if (typeof(arr[i]) == "string") {
	            if (arr[i].charCodeAt()<minNum) {
	                minNum = arr[i].charCodeAt();
	                minVul = arr[i];
	                index = i;
	            }
	        }else {
	            if (arr[i]<minNum) {
	                minNum = arr[i];
	                minVul = arr[i]
	                index = i;
	            }
	        }
	    };
	    return {"minNum":minVul,"index":index};
	}

	function arrSortMinToMax(arr){
	    var arrNew = [];
	    var arrOld = arr.concat();
	    console.log('before sort:' + JSON.stringify(arr));
	    for (var i = 0; i < arr.length; i++) {
	        arrNew.push(arrMinNum(arrOld).minNum);
	        arrOld.splice(arrMinNum(arrOld).index,1)
	    };
	    console.log('after sort:' + JSON.stringify(arrNew));
	    return (arrNew);
	}
	function arrMaxNum(arr){
	    var maxNum = -Infinity, index = -1,maxVul = "";
	    for (var i = 0; i < arr.length; i++) {
	        if (typeof(arr[i]) == "string") {
	            if (arr[i].charCodeAt()>maxNum) {
	                maxNum = arr[i].charCodeAt();
	                maxVul = arr[i];
	                index = i;
	            }
	        }else {
	            if (arr[i]>maxNum) {
	                maxNum = arr[i];
	                maxVul = arr[i];
	                index = i;
	            }
	        }
	    };
	    return {"maxNum":maxVul,"index":index};
	}
	function arrSortMaxToMin(arr){
	    var arrNew = [];
	    var arrOld = arr.slice(0);
	    for (var i = 0; i < arr.length; i++) {
	        arrNew.push(arrMaxNum(arrOld).maxNum);
	        arrOld.splice(arrMaxNum(arrOld).index,1);
	    };
	    return (arrNew);
	}

	return {
		minToMax : arrSortMinToMax,
		maxToMin : arrSortMaxToMin
	}
})();

function SkuSelector( options ){
	this._features = options.features;
	this._resultDatas = options.resultDatas;
	this._container = options.container;
	this._SKUResult = {}; 
	//当点击按钮检查状态完毕后调用，返回匹配结果对象信息
	this._onCheckReady = options.onCheckReady || function(){};
	this.init();
}

SkuSelector.prototype = {
	constructor : SkuSelector,

	init : function(){
		var me = this;
		var view = this.createView();
		$(this._container).html( view );
		this.bindEvent();
		this._buildSkuResult();
		//
		$(this._container).find('.sku-item-option').each(function() {
	        var self = $(this);
	        var attr_id = self.attr('id');
	        if(!me._SKUResult[attr_id]) {
	            self.attr('disabled', 'disabled');
	        }
	    })
	},

	bindEvent : function(){
		var me = this;

		//点击事件计算, 检查check
		$(this._container).find('.sku-item-option').click(function(){
			var $self = $(this);
			$self.toggleClass('selected');

			$self.siblings().removeClass('selected');

			$selectedItems = $(me._container).find('.sku-selector-item-options .selected');

			if($selectedItems.length){
				var selectedItemIds = [];

				$selectedItems.each(function() {
	                selectedItemIds.push($(this).attr('id'));
	            });
	            //简单数字排序
	            // selectedItemIds.sort(function(value1, value2) {
	            //     return parseInt(value1) - parseInt(value2);
	            // });
	            selectedItemIds = Util.Sort.minToMax(selectedItemIds);

	            var len = selectedItemIds.length;
	            me._onCheckReady(me._SKUResult[selectedItemIds.join(';')]);

	            //用已选中的节点验证待测试节点 underTestObjs
	            $(".sku-item-option").not($selectedItems).not($self).each(function() {
	                var siblingsSelectedObj = $(this).siblings('.selected');
	                var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
	                if(siblingsSelectedObj.length) {
	                    var siblingsSelectedObjId = siblingsSelectedObj.attr('id');
	                    for(var i = 0; i < len; i++) {
	                        (selectedItemIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedItemIds[i]);
	                    }
	                } else {
	                    testAttrIds = selectedItemIds.concat();
	                }
	                testAttrIds = testAttrIds.concat($(this).attr('id'));
	                //简单数字排序
	                // testAttrIds.sort(function(value1, value2) {
	                //     return parseInt(value1) - parseInt(value2);
	                // });
	                testAttrIds = Util.Sort.minToMax(testAttrIds);

	                if(!me._SKUResult[testAttrIds.join(';')]) {
	                    $(this).attr('disabled', 'disabled');
	                    $(this).removeClass('selected');
	                } else {
	                    $(this).removeAttr('disabled');
	                }
	            });
			}else {
	            //设置默认价格
	            me._onCheckReady(null);
	            //设置属性状态
	            $('.sku-item-option').each(function() {
	                if(me._SKUResult[$(this).attr('id')]){
	                	$(this).removeAttr('disabled');
	                }else{
	                	$(this).attr('disabled', 'disabled');
	                	$(this).removeClass('selected');
	                }
	            })
        	}
		});
	},

	createView : function(){
		var features = this._features;
		var viewHtml = ['<div class="sku-selector-box">'];
		for(var i = 0 , iLen = features.length; i < iLen ; i++){
			var item = features[i];
			var itemOptions = item.values;
			viewHtml.push('<div class="sku-selector-item">');
			viewHtml.push('	<div class="sku-selector-item-label">');
			viewHtml.push(		item.name + ':');
			viewHtml.push('	</div>');
			viewHtml.push('	<div class="sku-selector-item-options">');
			for(var j = 0 , jLen = itemOptions.length; j < jLen ; j ++){
				var itemOption = itemOptions[j];
				viewHtml.push('<button class="sku-item-option" id="' + itemOption.code + '">'+ itemOption.name +'</button>');
			}
			viewHtml.push('	</div>');
			viewHtml.push('</div>');
		}
		viewHtml.push('</div>');//end of sku-selector-box
		return viewHtml.join('');
	},

	_buildSkuResult : function(){
		var i, j, skuKeys = this._getKeysFromResultData( this._resultDatas );
	    for(i = 0; i < skuKeys.length; i++) {
	        var skuKey = skuKeys[i];//一条SKU信息key
	        var sku = this._getSkuFromResultDataByKey(skuKey); //一条SKU信息value
	        var skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组

	        // 简单数字排度
	        // skuKeyAttrs.sort(function(value1, value2) {
	        //     return parseInt(value1) - parseInt(value2);
	        // });
			skuKeyAttrs = Util.Sort.minToMax(skuKeyAttrs);

	        //对每个SKU信息key属性值进行拆分组合
	        var combArr = this.arrayCombine(skuKeyAttrs);
	        for(j = 0; j < combArr.length; j++) {
	            this._addToSkuResult(combArr[j], sku);
	        }
	 
	        //结果集接放入SKUResult
	        this._SKUResult[skuKeyAttrs.join(";")] = {
	            stock:sku.stock,
	            prices:[sku.price]
	        }
	    }
	},

	_addToSkuResult : function(combArrItem , sku){
	    var key = combArrItem.join(";");
	    if(this._SKUResult[key]) {//SKU信息key属性·
	        this._SKUResult[key].stock += sku.stock;
	        this._SKUResult[key].prices.push(sku.price);
	    } else {
	        this._SKUResult[key] = {
	            stock : sku.stock,
	            prices : [sku.price]
	        };
	    }
	},

	/**
	 * 从数组中生成指定长度的组合
	 */
 	arrayCombine : function(targetArr){
	    if(!targetArr || !targetArr.length) {
	        return [];
	    }
	
	    var len = targetArr.length;
	    var resultArrs = [];
	 
	    // 所有组合
	    for(var n = 1; n < len; n++) {
	        var flagArrs = this._getFlagArrs(len, n);
	        while(flagArrs.length) {
	            var flagArr = flagArrs.shift();
	            var combArr = [];
	            for(var i = 0; i < len; i++) {
	                flagArr[i] && combArr.push(targetArr[i]);
	            }
	            resultArrs.push(combArr);
	        }
	    }
	
	    return resultArrs;
 	},

 	_getKeysFromResultData : function( resultDatas ){
	    var keys = [];
	    for(var i = 0 , iLen = resultDatas.length; i < iLen ; i++){
	    	var resultItem = resultDatas[i];
	    	keys.push( resultItem.skuID );
	    }
	    console.log(JSON.stringify(keys));
	    return keys;
 	},

 	_getSkuFromResultDataByKey : function( key ){
 		for(var i = 0 , iLen = this._resultDatas.length ; i < iLen ; i ++){
 			var item = this._resultDatas[i];
 			if( key === item.skuID){
 				return item;
 			}
 		}
 		return null;
 	},

	/**
	 * 获得从m中取n的所有组合
	*/
	_getFlagArrs : function(m, n){
	    if(!n || n < 1) {
	        return [];
	    }
	 
	    var resultArrs = [],
	        flagArr = [],
	        isEnd = false,
	        i, j, leftCnt;
	 
	    for (i = 0; i < m; i++) {
	        flagArr[i] = i < n ? 1 : 0;
	    }
	 
	    resultArrs.push(flagArr.concat());
	    while (!isEnd) {
	        leftCnt = 0;
	        for (i = 0; i < m - 1; i++) {
	            if (flagArr[i] == 1 && flagArr[i+1] == 0) {
	                for(j = 0; j < i; j++) {
	                    flagArr[j] = j < leftCnt ? 1 : 0;
	                }
	                flagArr[i] = 0;
	                flagArr[i+1] = 1;
	                var aTmp = flagArr.concat();
	                resultArrs.push(aTmp);
	                if(aTmp.slice(-n).join("").indexOf('0') == -1) {
	                    isEnd = true;
	                }
	                break;
	            }
	            flagArr[i] == 1 && leftCnt++;
	        }
	    }
	    return resultArrs;
	}
}