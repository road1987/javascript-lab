/*
* PreLoader - jQuery plugin
* Create a Loading Screen to preload images and content for you website
*
* Name:			perLoader.js
* Author:		hongchun.li
* Date:			2014-12-5		
* Version:		1.0
* Reference:		http://www.inwebson.com/demo/jpreloader-v2/
*	
*/

(function($) {
	var items = new Array(),
		errors = new Array(),
		current = 0;
		
	var preLoaderOptions = {
			onBeforeLoad : function(){},
			onLoadChange : function(percent){},
			onComplete : function(){}, 
			autoClose: true,
			loadOnce: false,
			loadOnceExpired : 300,
			overLayer : '.preLoaderOverlayer'
	}
	
	//cookie
	var getCookie = function() {
		if( preLoaderOptions.loadOnce ) {
			var cookies = document.cookie.split('; ');
			for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
				if ((parts.shift()) === "preloader") {
					return (parts.join('='));
				}
			}
			return false;
		} else {
			return false;
		}
	}

    //expires time , second count
	var setCookie = function(expires) {
			var exdate = new Date();
			exdate.setTime( exdate.getTime() + (expires*1000) );
			var c_value = ((expires==null) ? "" : "expires=" + exdate.toUTCString());
			document.cookie="preloader=loaded; " + c_value;
			return true;
	}
	
	//get all images from css and <img> tag
	var getImages = function(element) {
		$(element).find('*:not(script)').each(function() {
			var url = "";

			if ($(this).css('background-image').indexOf('none') == -1 && $(this).css('background-image').indexOf('-gradient') == -1) {
				url = $(this).css('background-image');
				if(url.indexOf('url') != -1) {
					var temp = url.match(/url\((.*?)\)/);
					url = temp[1].replace(/\"/g, '');
				}
			} else if ($(this).get(0).nodeName.toLowerCase() == 'img' && typeof($(this).attr('src')) != 'undefined') {
				url = $(this).attr('src');
			}
			
			if (url.length > 0) {
				items.push(url);
			}
		});
	}
	
	//create preloaded image
	var preloading = function() {
		preLoaderOptions.onBeforeLoad.call(contextAPI);
		for (var i = 0; i < items.length; i++) {
			if(loadImg(items[i]));
		}
	}
	
	var loadImg = function(url) {
		var imgLoad = new Image();
		$(imgLoad).load(function() {
			completeLoading();
		}).error(function() {
			errors.push($(this).attr('src'));
			completeLoading();
		}).attr('src', url);
	}
	
	
	//update progress bar once image loaded
	var completeLoading = function() {
		current++;
		var percent = Math.round((current / items.length) * 100);
			preLoaderOptions.onLoadChange.call( contextAPI );
		
		if(current >= items.length) {
			preLoaderOptions.onComplete.call(contextAPI);
			if(preLoaderOptions.autoClose){
				removeOverLayer();
			}
		}
		return true;
	}
	
	function removeOverLayer(){
		$(preLoaderOptions.overLayer).fadeOut(800, function() {
			$(preLoaderOptions.overLayer).remove();
		});
	}
	
	var contextAPI = {
			removeOverLayer : removeOverLayer,
			getLoadedPercent : function(){
				return Math.round((current / items.length) * 100);
			}
	}
	
	$.fn.preLoader = function(options, callback) {
        if(options) {
            $.extend(preLoaderOptions, options );
        }
        this.each(function() {
			if( !(getCookie()) ) {
				getImages(this);
				preloading();
				if(preLoaderOptions.loadOnce){
					setCookie(preLoaderOptions.loadOnceExpired); //
				}
			}else {	//onetime load / cookie is set
				preLoaderOptions.onComplete.call(contextAPI);
				removeOverLayer();
			}
		});
        return contextAPI;
    };

})(jQuery);