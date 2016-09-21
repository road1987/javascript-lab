requirejs.config({
    paths: {
        jquery: 'jquery-1.10.2',
        carousel : 'lib/jquery.tinycarousel',
        underscore: 'underscore-min',
        TabsPanel: 'component/TabsPanel',
        ImageLink: 'component/ImageLink',
        TextLinkBox: 'component/TextLinkBox',
        CarouselBox: 'component/CarouselBox',

        //replace with ajax request or anything else in production environment
        floor1 : 'configData/floor1',
        floor2 : 'configData/floor2',
        floor3 : 'configData/floor3',
        floor4 : 'configData/floor4',
        floor5 : 'configData/floor5',
        floor6 : 'configData/floor6',
        floor7 : 'configData/floor7',
        floor8 : 'configData/floor8',
        floor9 : 'configData/floor9',
        floor10 : 'configData/floor10',
        floor11 : 'configData/floor11'
    }
    ,shim: {
		'underscore': {
            exports: '_'
        }
    }
});

require(["underscore" , "jquery" , "TabsPanel" ], function( _ , $ , TabsPanel) {
	
		var getModulesInViewport = function(){
			var $window = $(window);
			var $lazyModules = $(".lazy-fn");
			var loadModules = [];

			$lazyModules.each(function(i , item){
				if( !( $(window).scrollTop() > ($( item ).offset().top+$( item ).outerHeight())||
					 ($(window).scrollTop()+$(window).height()) < $( item ).offset().top ) ){
					loadModules.push(item);
				}
			});
			return loadModules;
		}

		var checkLoading = function(){
			var loadModules = getModulesInViewport();
			$.each(loadModules , function(i , item){
				var dataPath = $(item).data('path');
				require([dataPath],function(data){
					var panel = new TabsPanel({
						renderTo : "#" + $(item).attr("id"),
						data : data ,
						afterRender : function(){
							$(item).removeClass("lazy-fn");
						}
					});
				});
			})
		}

		var timer = null;
		$(document).scroll(function(){
			if(timer){
				clearTimeout(timer);
			}
			timer = setTimeout(checkLoading, 300);
		});

		$(document).ready(function(){
			checkLoading();
		});
});