(function($) {

	var scrollBarController = {

		__name: 'h5.ui.components.scroll.scrollBarController',

		_totalNum: null,

		_showlNum: null,

		_scrollItemMinHight: 25,

		_$mainArea: null,

		_$contentArea: null,

		_$scrollBar: null,

		_$scrollItem: null,

		_mouseY: null,

		_scrollItemTop: null,

		init: function(scrollParam) {

			this._totalNum = scrollParam.totalNum;
			this._showlNum = scrollParam.showNum;

			// 如果数据总数小于画面显示条数，则不需要生成滚动条
			if(this._totalNum <= this._showlNum) {
				return;
			}

			// 滚动区域
			var _$mainArea = $(scrollParam.mainArea);
			var _$contentArea = $(scrollParam.contentArea);

			this._$mainArea = _$mainArea;
			this._$contentArea = _$contentArea;

			// 创建滚动条
			this._createScroll();
		},

		_createScroll: function() {

			var $mainArea = this._$mainArea;
			var $contentArea = this._$contentArea;

			// 滚动条
			var $scrollBar = $('<div>');
			$scrollBar.addClass('scrollBarArea');

			// 滚动块
			var $scrollItem = $('<div>');
			$scrollItem.addClass('scrollBarKnob');

            $scrollBar.append($scrollItem);
			$(this.rootElement).append($scrollBar);

			// 样式调整

			var conHeight = $contentArea.height();
			var conWidth = $contentArea.width();


			var mainAreaHeight = $mainArea.height();

			var scrollHeight = parseFloat(mainAreaHeight*(this._showlNum/this._totalNum));

			if(scrollHeight < this._scrollItemMinHight) {
				scrollHeight = this._scrollItemMinHight;
			}

			var offset_left = $contentArea.offset().left;
			var offset_top = $contentArea.offset().top;

			$scrollBar.css({
				'width': '23px',
				'height': mainAreaHeight + 'px',
				'left': (offset_left + conWidth) + 'px',
				'top': offset_top + 'px',
				'position': 'absolute',
				'background': '#A9A9A9'
			});
			
			var radius = '5px';
			
			if(scrollHeight > 40) {
				radius = '15px'; 
			}
			$scrollItem.css({
				'height': scrollHeight + 'px',
				'background': '#4D4D4D',
				'position': 'absolute',
				'width': '23px',
				'border-radius': radius
			});

			this._$scrollBar = $scrollBar;
			this._$scrollItem = $scrollItem;
		},

		scrollStart: function(context, $el) {
			var event = context.event;
			event.stopPropagation();

			var css_top = $el.css('top');
			var scrollItemTop = parseFloat(css_top.substr(0, css_top.length - 2));

			this._scrollItemTop = scrollItemTop;
			this._mouseY = event.pageY;

			$el.addClass('tracking');
		},

		scrollMove: function(context, $el) {

			var event = context.event;
			var mousPosY = event.pageY;

			var top = mousPosY - this._mouseY + this._scrollItemTop;

			if(top < 0)
				top = 0;
			if(top > this._$scrollBar.height() - $el.height()) {
				top = this._$scrollBar.height() - $el.height();
			}
			$el.css('top', top + 'px');

		},

		scrollEnd: function(context, $el) {
			this._mouseY = null;
			this._scrollItemTop = null;
			$el.removeClass('tracking');
		},

		mousewheel: function(top) {
			if(top < 0)
				top = 0;
			if(top > this._$scrollBar.height() - this._$scrollItem.height()) {
				top = this._$scrollBar.height() - this._$scrollItem.height();
			}
			this._$scrollItem.css('top', top + 'px');
		}


	};
	h5.core.expose(scrollBarController);
})(jQuery);