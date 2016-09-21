define(["underscore" , "jquery"], function( _ , $ ) {

	function TextLinkBox( options ){
		this.data = options.data || {};
		this._renderTo = options.renderTo || document.body;
		this.renderTo(this._renderTo);
	}

	TextLinkBox.prototype = {

		renderTo : function( elem ){
			var tpl = this._createTpl();
			var html = tpl(this.data);
			$(elem).append(html);
			this._bindEvent();
		},

		_bindEvent : function(){

		},

		_createTpl : function(){
			var tplStrArray = [
			'<div class="text-link-box clearfix">',
			'	<ul>',	
			'		<% _.each( listData , function(item , i ){ %>',
			'		<li class="text-link">',
			'			<a href="<%= item.linkUrl %>">',
			'				<%= item.text %>',
			'			</a>',
			'		</li>',
			'		<% }) %>',
			'	</ul>',
			'</div>'];
			return _.template(tplStrArray.join(''));
		}
	}
	return TextLinkBox;
});