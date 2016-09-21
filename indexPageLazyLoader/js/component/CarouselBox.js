define(["underscore" , "jquery" , "carousel"], function( _ , $ ) {

	function CarouselBox( options ){
		this.data = options.data || {};
		this._renderTo = options.renderTo || document.body;
		this.renderTo(this._renderTo);
	}

	CarouselBox.prototype = {
		renderTo : function( elem ){
			var tpl = this._createTpl();
			var html = tpl(this.data);
			$(elem).append(html);
			$(elem).find('.carousel-box').tinycarousel();
			this._bindEvent();
		},

		_bindEvent : function(){

		},

		_createTpl : function(){
			var tplStrArray = [
			'<div class="carousel-box">',
			'<a class="buttons prev" href="#"></a>',
			'<div class="viewport">',
			'	<ul class="overview">',	
			'		<% _.each( listData , function(item , i ){ %>',
			'		<li class="carousel-item">',
			'			<% _.each( item.itemData , function(item , i ){ %>',
			'			<a href="<%= item.linkUrl %>">',
			'				<img src="<%= item.imgUrl %>"/>',
			'			</a>',
			'			<% }) %>',
			'		</li>',
			'		<% }) %>',
			'	</ul>',
			'</div>',
			'<a class="buttons next" href="#"></a>',
			'</div>'];
			return _.template(tplStrArray.join(''));
		}
	}
	return CarouselBox;
});