define(["underscore" , "jquery"], function( _ , $ ) {

	function ImageLink( options ){
		this.data = options.data || {};
		this._renderTo = options.renderTo || document.body;
		this.renderTo(this._renderTo);
	}

	ImageLink.prototype = {

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
			'<a href="<%= linkUrl %>">',
			'	<img src="<%= imgUrl %>"/>',
			'</a>'];
			return _.template(tplStrArray.join(''));
		}
	}
	return ImageLink;
});