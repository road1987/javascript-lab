define(["underscore" , "jquery", "ImageLink" ,"TextLinkBox","CarouselBox"], 
	function( _ , $ , ImageLink , TextLinkBox , CarouselBox) {

	function TabsPanel( options ){
		this._options = options|| {};
		this.renderTo(this._options.renderTo);
	}

	TabsPanel.prototype = {

		renderTo : function( elem ){
			this._beforeRender();
			var tpl = this._createTpl();
			var html = tpl(this._options.data);
			$( elem ).append(html);
			this._bindEvent();
			this._afterRender();
		},

		_beforeRender : function(){

		},

		_afterRender : function(){
			//after render 
			new ImageLink({ renderTo : this._options.renderTo + ' .J_ImageLinkBox' , data : this._options.data.imageLink });
			new TextLinkBox({ renderTo : this._options.renderTo + ' .J_TextLinkBox' , data : this._options.data.textLinkList });
			new CarouselBox({ renderTo : this._options.renderTo + ' .J_CarouselLinkBox' , data : this._options.data.carousel  });

			if(this._options.afterRender && typeof this._options.afterRender === "function"){
				this._options.afterRender();
			}
		},

		_bindEvent : function(){
			var me = this;
			$(this._options.renderTo).find(".tabs-panel-nav li.tabs-panel-nav-item").hover(function(e){
				if($(this).hasClass("selected")){
					return ;
				}
				var dataIndex = $(this).attr("data-index");
				$(me._options.renderTo).find(".tabs-panel-nav li.selected").removeClass("selected");
				$(me._options.renderTo).find(".tabs-panel-content").hide();
				$(this).addClass("selected");
				$("#" + dataIndex).fadeIn();
			});
		},

		_createTpl : function(){
			var uniqueId = _.uniqueId();
			var tplStrArray = [
			'<div class="tabs-panel clearfix">',			
			'	<div class="tabs-panel-header">',	
			'		<div class="tabs-panel-title">',
			'			<%=title%>',
			'		</div>',
			'		<ul class="tabs-panel-nav">',
			' 			<% _.each(tabs , function(tabItem,i){ %>',
			' 			<li class="tabs-panel-nav-item <%= (0==i)? \"selected\":\"\" %>" data-index="js_tabs-panel-nav-' + uniqueId + '-<%=i%>" ><a><%=tabItem.title%></a></li>',			
			' 			<% }) %>',
			'		</ul>',
			'	</div>',
			'	<div class="tabs-panel-body clearfix">',
			'		<div class="tabs-panel-side-box">',
			'			<div class="J_ImageLinkBox image-link-box-slot">',
/*			'				<a href="<%= sider.imgLink.linkUrl %>">',
			'					<img src="<%= sider.imgLink.imgUrl %>"/>',
			'				</a>',*/
			'			</div>',
			'			<div class="J_TextLinkBox text-link-box-slot">',
			'			</div>',
			'			<div class="J_CarouselLinkBox carousel-link-box-slot clearfix">',
			'			</div>',
			'		</div>',
			'		<div class="tabs-panel-content-box">',			
			' 			<% _.each(tabs , function(tabItem , i){ %>',
			'			<div id="js_tabs-panel-nav-' + uniqueId + '-<%=i%>" class="tabs-panel-content <%= tabItem.type %> clearfix <%= (0==i)? \"selected\":\"\" %>">',			
			' 				<% _.each(tabItem.items , function(item){ %>',
			' 					<div class="item-box <%=item.cls || \"\"%>">',
			' 						<img src="<%=item.img%>"/>',
			' 						<div class="item-name"><%=item.name%></div>',
			' 						<div class="item-desc"><%=item.desc%></div>',
			'					</div>',
			' 				<% }) %>',
			'			</div>',
			' 			<% }) %>',
			'		</div>',
			'	</div>',
			'</div>'];
			return _.template(tplStrArray.join(''));
		}
	}
	return TabsPanel;
});